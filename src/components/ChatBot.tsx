import { useState, useRef, useEffect } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { Button } from './ui/button'
import { MessageCircle, X, Send, Loader2, Minus } from 'lucide-react'
import { SYSTEM_PROMPT, WELCOME_MESSAGE } from '@/lib/chatbotConfig'
import { 
    loadDeviceData, 
    analyzeAllData, 
    analyzeByUser, 
    analyzeByDay,
    analyzeByTimeRange,
    compareUsers,
    getTopSafeDrivers,
    getTopDangerousDrivers,
    generateFullReport,
    getUserEmail,
    getUserContactInfo,
    type DeviceData
} from '@/lib/dataAnalyzer'

interface Message {
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
}

const INITIAL_POSITION = { x: window.innerWidth - 420, y: 100 }

export function ChatBot() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [size, setSize] = useState({ width: 400, height: 600 })
    const [position, setPosition] = useState(INITIAL_POSITION)
    const [deviceData, setDeviceData] = useState<DeviceData[]>([])
    
    const chatRef = useRef<HTMLDivElement>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const resizeRef = useRef<{ isResizing: boolean; direction: string }>({
        isResizing: false,
        direction: ''
    })
    const dragRef = useRef<{ isDragging: boolean; startX: number; startY: number }>({
        isDragging: false,
        startX: 0,
        startY: 0
    })

    // Inicializar Gemini con el modelo 2.5 Flash (rápido y eficiente)
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEIMINI_API_KEY || '')
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    
    // Cargar datos del CSV al montar el componente
    useEffect(() => {
        loadDeviceData().then(data => {
            setDeviceData(data);
            console.log(`✅ Datos cargados: ${data.length} registros`);
        });
    }, []);

    // Auto-scroll al final de los mensajes
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Mensaje de bienvenida en el chat
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{
                role: 'assistant',
                content: WELCOME_MESSAGE,
                timestamp: new Date()
            }])
        }
    }, [])

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return

        const userMessage: Message = {
            role: 'user',
            content: input,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        const currentInput = input.toLowerCase()
        setInput('')
        setIsLoading(true)

        try {
            // Detectar si el usuario pide un reporte o análisis
            let contextualData = '';
            
            // Email o información de contacto
            if (currentInput.includes('email') || currentInput.includes('correo') || currentInput.includes('contacto')) {
                const usuarios = [...new Set(deviceData.map(d => d.usuario))];
                const usuarioEncontrado = usuarios.find(u => currentInput.includes(u.toLowerCase()));
                
                if (usuarioEncontrado) {
                    const contactInfo = getUserContactInfo(deviceData, usuarioEncontrado);
                    if (contactInfo) {
                        contextualData = `\n\n[INFORMACIÓN DE CONTACTO - ${usuarioEncontrado.toUpperCase()}]\n` +
                            `Email: ${contactInfo.email}\n` +
                            `Total de registros: ${contactInfo.totalRegistros}\n` +
                            `Aceleración promedio: ${contactInfo.aceleracionPromedio}g\n` +
                            `Nivel de riesgo: ${contactInfo.nivelRiesgo}`;
                    }
                } else {
                    // Si no se especifica usuario, mostrar lista de emails
                    const emailList = usuarios.map(u => {
                        const email = getUserEmail(deviceData, u);
                        return `${u}: ${email}`;
                    }).join('\n');
                    contextualData = `\n\n[LISTA DE EMAILS DE USUARIOS]\n${emailList}`;
                }
            }
            // Generar reporte completo
            else if (currentInput.includes('reporte') || currentInput.includes('análisis general') || currentInput.includes('estadísticas generales')) {
                const report = generateFullReport(deviceData);
                contextualData = `\n\n[DATOS ACTUALES DEL SISTEMA]\n${report}`;
            }
            // Análisis de usuario específico
            else if (currentInput.includes('usuario') || currentInput.includes('conductor')) {
                const usuarios = [...new Set(deviceData.map(d => d.usuario))];
                const usuarioEncontrado = usuarios.find(u => currentInput.includes(u.toLowerCase()));
                
                if (usuarioEncontrado) {
                    const userAnalysis = analyzeByUser(deviceData, usuarioEncontrado);
                    if (userAnalysis) {
                        contextualData = `\n\n[ANÁLISIS DE ${usuarioEncontrado.toUpperCase()}]\n` +
                            `Email: ${userAnalysis.email}\n` +
                            `Total de registros: ${userAnalysis.totalRegistros}\n` +
                            `Aceleración promedio: ${userAnalysis.aceleracionPromedio}g\n` +
                            `Nivel de riesgo: ${userAnalysis.nivelRiesgo}\n` +
                            `Distribución: ${userAnalysis.distribucionRiesgo.seguros} seguros, ${userAnalysis.distribucionRiesgo.precaucion} precaución, ${userAnalysis.distribucionRiesgo.peligrosos} peligrosos\n` +
                            `Día más activo: ${userAnalysis.diaMasActivo}\n` +
                            `Horario más activo: ${userAnalysis.horarioMasActivo}`;
                    }
                }
            }
            // Top conductores
            else if (currentInput.includes('mejores') || currentInput.includes('top') || currentInput.includes('ranking')) {
                const topSafe = getTopSafeDrivers(deviceData, 5);
                const topDanger = getTopDangerousDrivers(deviceData, 3);
                
                contextualData = `\n\n[TOP CONDUCTORES]\n` +
                    `🏆 TOP 5 MÁS SEGUROS:\n${topSafe.map((u, i) => `${i + 1}. ${u.usuario} - ${u.aceleracionPromedio}g`).join('\n')}\n\n` +
                    `⚠️ TOP 3 MAYOR RIESGO:\n${topDanger.map((u, i) => `${i + 1}. ${u.usuario} - ${u.aceleracionPromedio}g`).join('\n')}`;
            }
            // Análisis por día
            else if (currentInput.includes('lunes') || currentInput.includes('martes') || currentInput.includes('miércoles') || 
                     currentInput.includes('jueves') || currentInput.includes('viernes') || currentInput.includes('sábado') || currentInput.includes('domingo')) {
                const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
                const diaEncontrado = dias.find(d => currentInput.includes(d.toLowerCase()));
                
                if (diaEncontrado) {
                    const dayAnalysis = analyzeByDay(deviceData, diaEncontrado);
                    if (dayAnalysis) {
                        contextualData = `\n\n[ANÁLISIS ${diaEncontrado.toUpperCase()}]\n` +
                            `Total de registros: ${dayAnalysis.totalRegistros}\n` +
                            `Usuarios activos: ${dayAnalysis.usuariosActivos}\n` +
                            `Aceleración promedio: ${dayAnalysis.aceleracionPromedio}g\n` +
                            `Distribución: ${dayAnalysis.distribucionRiesgo.seguros} seguros, ${dayAnalysis.distribucionRiesgo.precaucion} precaución, ${dayAnalysis.distribucionRiesgo.peligrosos} peligrosos`;
                    }
                }
            }
            // Análisis por horario
            else if (currentInput.includes('mañana') || currentInput.includes('tarde') || currentInput.includes('noche')) {
                let rangoHora = '';
                if (currentInput.includes('mañana')) rangoHora = 'Mañana';
                else if (currentInput.includes('tarde')) rangoHora = 'Tarde';
                else if (currentInput.includes('noche')) rangoHora = 'Noche';
                
                if (rangoHora) {
                    const timeAnalysis = analyzeByTimeRange(deviceData, rangoHora);
                    if (timeAnalysis) {
                        contextualData = `\n\n[ANÁLISIS ${rangoHora.toUpperCase()}]\n` +
                            `Total de registros: ${timeAnalysis.totalRegistros}\n` +
                            `Aceleración promedio: ${timeAnalysis.aceleracionPromedio}g\n` +
                            `Registros peligrosos: ${timeAnalysis.registrosPeligrosos}\n` +
                            `Nivel de riesgo: ${timeAnalysis.nivelRiesgo}`;
                    }
                }
            }
            // Comparar conductores
            else if (currentInput.includes('comparar') || currentInput.includes('vs')) {
                const general = analyzeAllData(deviceData);
                contextualData = `\n\n[ESTADÍSTICAS GENERALES]\n` +
                    `Total de usuarios: ${general.totalUsuarios}\n` +
                    `Total de registros: ${general.totalRegistros}\n` +
                    `Usuarios: ${general.usuarios.join(', ')}\n` +
                    `Aceleración promedio global: ${general.aceleracion.promedio}g`;
            }

            // Construir el historial de conversación
            const conversationHistory = messages
                .filter(msg => msg.content !== WELCOME_MESSAGE)
                .map(msg => ({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.content }]
                }))

            const chat = model.startChat({
                history: conversationHistory,
                generationConfig: {
                    maxOutputTokens: 400,
                    temperature: 0.7,
                },
                systemInstruction: {
                    role: 'system',
                    parts: [{ text: SYSTEM_PROMPT + contextualData + '\n\nIMPORTANTE: Usa los datos proporcionados arriba para responder de forma precisa. Mantén tus respuestas breves y concisas (máximo 2-3 párrafos cortos). Ve directo al punto.' }]
                }
            })

            const result = await chat.sendMessage(input)
            const response = await result.response
            const text = response.text()

            if (!text || text.trim() === '') {
                throw new Error('La respuesta del modelo está vacía')
            }

            const assistantMessage: Message = {
                role: 'assistant',
                content: text,
                timestamp: new Date()
            }

            setMessages(prev => [...prev, assistantMessage])
        } catch (error: any) {
            console.error('Error completo:', error)
            
            const errorMessage: Message = {
                role: 'assistant',
                content: `Lo siento, hubo un problema: ${error?.message || 'Error desconocido'}. Por favor, intenta reformular tu pregunta.`,
                timestamp: new Date()
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    // Manejo de drag (arrastrar ventana)
    const handleDragStart = (e: React.MouseEvent) => {
        // No permitir drag si se está haciendo resize o si se clickea un botón
        const target = e.target as HTMLElement
        if (target.closest('button') || resizeRef.current.isResizing) {
            return
        }
        
        // Solo permitir drag desde el header
        if (target.closest('.chat-header')) {
            e.preventDefault()
            dragRef.current = {
                isDragging: true,
                startX: e.clientX - position.x,
                startY: e.clientY - position.y
            }

            const handleDragMove = (moveEvent: MouseEvent) => {
                if (!dragRef.current.isDragging) return

                const newX = moveEvent.clientX - dragRef.current.startX
                const newY = moveEvent.clientY - dragRef.current.startY

                // Mantener la ventana dentro de los límites de la pantalla
                const maxX = window.innerWidth - size.width
                const maxY = window.innerHeight - size.height

                setPosition({
                    x: Math.max(0, Math.min(maxX, newX)),
                    y: Math.max(0, Math.min(maxY, newY))
                })
            }

            const handleDragEnd = () => {
                dragRef.current.isDragging = false
                document.removeEventListener('mousemove', handleDragMove)
                document.removeEventListener('mouseup', handleDragEnd)
            }

            document.addEventListener('mousemove', handleDragMove)
            document.addEventListener('mouseup', handleDragEnd)
        }
    }

    // Cerrar y volver a posición original
    const handleClose = () => {
        setIsOpen(false)
        setPosition(INITIAL_POSITION)
    }

    // Minimizar y volver a posición original
    const handleMinimize = () => {
        setIsOpen(false)
        setPosition(INITIAL_POSITION)
    }

    // Manejo de resize
    const handleMouseDown = (e: React.MouseEvent, direction: string) => {
        e.preventDefault()
        e.stopPropagation() // Evitar que se active el drag
        
        const startX = e.clientX
        const startY = e.clientY
        const startWidth = size.width
        const startHeight = size.height
        const startPosX = position.x
        const startPosY = position.y
        
        resizeRef.current = { isResizing: true, direction }
        
        const handleMouseMove = (moveEvent: MouseEvent) => {
            if (!resizeRef.current.isResizing) return

            const { direction } = resizeRef.current
            const deltaX = moveEvent.clientX - startX
            const deltaY = moveEvent.clientY - startY

            let newWidth = startWidth
            let newHeight = startHeight
            let newX = startPosX
            let newY = startPosY

            // Resize horizontal
            if (direction.includes('e')) {
                newWidth = Math.max(300, Math.min(800, startWidth + deltaX))
            }
            if (direction.includes('w')) {
                newWidth = Math.max(300, Math.min(800, startWidth - deltaX))
                newX = startPosX + (startWidth - newWidth)
            }

            // Resize vertical
            if (direction.includes('s')) {
                newHeight = Math.max(400, Math.min(800, startHeight + deltaY))
            }
            if (direction.includes('n')) {
                newHeight = Math.max(400, Math.min(800, startHeight - deltaY))
                newY = startPosY + (startHeight - newHeight)
            }

            // Asegurar que la ventana no se salga de la pantalla
            newX = Math.max(0, Math.min(window.innerWidth - newWidth, newX))
            newY = Math.max(0, Math.min(window.innerHeight - newHeight, newY))

            setSize({ width: newWidth, height: newHeight })
            setPosition({ x: newX, y: newY })
        }

        const handleMouseUp = () => {
            resizeRef.current.isResizing = false
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
    }

    return (
        <>
            {/* Botón flotante */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 w-16 h-16 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg flex items-center justify-center z-50 transition-all hover:scale-110"
                >
                    <MessageCircle className="w-8 h-8" />
                </button>
            )}

            {/* Ventana del chat */}
            {isOpen && (
                <div
                    ref={chatRef}
                    className="fixed bg-gray-900 rounded-lg shadow-2xl z-50 border border-gray-700 flex flex-col"
                    style={{
                        width: `${size.width}px`,
                        height: `${size.height}px`,
                        left: `${position.x}px`,
                        top: `${position.y}px`
                    }}
                >
                    {/* Bordes de resize - con z-index alto para estar por encima */}
                    <div className="absolute top-0 left-0 w-2 h-full cursor-w-resize z-50 hover:bg-red-600/20" onMouseDown={(e) => handleMouseDown(e, 'w')} />
                    <div className="absolute top-0 right-0 w-2 h-full cursor-e-resize z-50 hover:bg-red-600/20" onMouseDown={(e) => handleMouseDown(e, 'e')} />
                    <div className="absolute top-0 left-0 w-full h-2 cursor-n-resize z-50 hover:bg-red-600/20" onMouseDown={(e) => handleMouseDown(e, 'n')} />
                    <div className="absolute bottom-0 left-0 w-full h-2 cursor-s-resize z-50 hover:bg-red-600/20" onMouseDown={(e) => handleMouseDown(e, 's')} />
                    <div className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize z-50 hover:bg-red-600/30" onMouseDown={(e) => handleMouseDown(e, 'nw')} />
                    <div className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize z-50 hover:bg-red-600/30" onMouseDown={(e) => handleMouseDown(e, 'ne')} />
                    <div className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize z-50 hover:bg-red-600/30" onMouseDown={(e) => handleMouseDown(e, 'sw')} />
                    <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50 hover:bg-red-600/30" onMouseDown={(e) => handleMouseDown(e, 'se')} />

                    {/* Header */}
                    <div 
                        className="chat-header bg-gray-800 p-4 flex items-center justify-between border-b border-gray-700 cursor-move select-none shrink-0"
                        onMouseDown={handleDragStart}
                    >
                        <div className="flex items-center gap-2">
                            <MessageCircle className="w-5 h-5 text-red-600" />
                            <h3 className="font-semibold text-white">Pay$afe Assistant</h3>
                        </div>
                        <div className="flex gap-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleMinimize}
                                className="text-gray-400 hover:text-white hover:bg-gray-700"
                            >
                                <Minus className="w-5 h-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClose}
                                className="text-gray-400 hover:text-white hover:bg-gray-700"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Mensajes */}
                    <div 
                        className="overflow-y-scroll p-4 space-y-3 bg-gray-900 flex-1"
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex items-end gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {/* Avatar del bot */}
                                {message.role === 'assistant' && (
                                    <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center shrink-0 mb-1">
                                        <MessageCircle className="w-4 h-4 text-white" />
                                    </div>
                                )}
                                
                                {/* Burbuja de mensaje */}
                                <div
                                    className={`relative max-w-[75%] rounded-2xl p-3 ${
                                        message.role === 'user'
                                            ? 'bg-red-600 text-white rounded-br-sm'
                                            : 'bg-gray-800 text-white border border-gray-700 rounded-bl-sm'
                                    }`}
                                >
                                    {/* Cola de la burbuja */}
                                    <div 
                                        className={`absolute bottom-0 ${
                                            message.role === 'user' 
                                                ? 'right-0 translate-x-0' 
                                                : 'left-0 translate-x-0'
                                        }`}
                                        style={{
                                            width: 0,
                                            height: 0,
                                            borderStyle: 'solid',
                                            ...(message.role === 'user' 
                                                ? {
                                                    borderWidth: '0 0 10px 10px',
                                                    borderColor: 'transparent transparent transparent #DC2626',
                                                    right: '-4px',
                                                    bottom: '0'
                                                }
                                                : {
                                                    borderWidth: '0 10px 10px 0',
                                                    borderColor: 'transparent #1F2937 transparent transparent',
                                                    left: '-4px',
                                                    bottom: '0'
                                                }
                                            )
                                        }}
                                    />
                                    
                                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                                    <p className="text-xs opacity-60 mt-2 text-right">
                                        {message.timestamp.toLocaleTimeString('es-MX', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-end gap-2 justify-start">
                                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center shrink-0 mb-1">
                                    <MessageCircle className="w-4 h-4 text-white" />
                                </div>
                                <div className="bg-gray-800 rounded-2xl rounded-bl-sm p-3 border border-gray-700">
                                    <Loader2 className="w-5 h-5 animate-spin text-red-600" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-gray-800 border-t border-gray-700 shrink-0">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Escribe tu mensaje..."
                                className="flex-1 bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                                disabled={isLoading}
                            />
                            <Button
                                onClick={handleSendMessage}
                                disabled={isLoading || !input.trim()}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                <Send className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
