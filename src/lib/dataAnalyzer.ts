// Sistema de análisis de datos para el ChatBot de Pay$afe

export interface DeviceData {
    usuario: string;
    lat: number;
    lng: number;
    aceleracion: number;
    temperatura: number;
    dia: string;
    hora: string;
    email: string;
}

// Cargar datos del CSV
export async function loadDeviceData(): Promise<DeviceData[]> {
    try {
        const response = await fetch('/data/usuarios_dispositivos.csv');
        const csvText = await response.text();
        
        const lines = csvText.trim().split('\n');
        const data: DeviceData[] = lines.slice(1).map(line => {
            const values = line.split(',');
            return {
                usuario: values[0],
                lat: parseFloat(values[1]),
                lng: parseFloat(values[2]),
                aceleracion: parseFloat(values[3]),
                temperatura: parseFloat(values[4]),
                dia: values[5],
                hora: values[6],
                email: values[7] || ''
            };
        });
        
        return data;
    } catch (error) {
        console.error('Error al cargar datos:', error);
        return [];
    }
}

// Obtener rango horario
export function getHourRange(hora: string): string {
    const hour = parseInt(hora.split(':')[0]);
    if (hour >= 7 && hour < 12) return 'Mañana';
    if (hour >= 12 && hour < 17) return 'Tarde';
    if (hour >= 17 && hour < 20) return 'Noche';
    return 'Otro';
}

// Clasificar nivel de riesgo por aceleración
export function getRiskLevel(aceleracion: number): string {
    if (aceleracion >= 2.0) return 'Peligroso';
    if (aceleracion >= 1.5) return 'Precaución';
    return 'Seguro';
}

// Obtener email de un usuario
export function getUserEmail(data: DeviceData[], usuario: string): string | null {
    const userData = data.find(d => d.usuario === usuario);
    return userData ? userData.email : null;
}

// Obtener información de contacto completa de un usuario
export function getUserContactInfo(data: DeviceData[], usuario: string) {
    const userData = data.filter(d => d.usuario === usuario);
    
    if (userData.length === 0) {
        return null;
    }
    
    const email = userData[0].email;
    const totalRegistros = userData.length;
    const aceleraciones = userData.map(d => d.aceleracion);
    const aceleracionPromedio = aceleraciones.reduce((a, b) => a + b, 0) / aceleraciones.length;
    
    return {
        usuario,
        email,
        totalRegistros,
        aceleracionPromedio: aceleracionPromedio.toFixed(2),
        nivelRiesgo: getRiskLevel(aceleracionPromedio)
    };
}

// Análisis general de todos los datos
export function analyzeAllData(data: DeviceData[]) {
    const totalRegistros = data.length;
    const usuarios = [...new Set(data.map(d => d.usuario))];
    
    // Estadísticas de aceleración
    const aceleraciones = data.map(d => d.aceleracion);
    const aceleracionPromedio = aceleraciones.reduce((a, b) => a + b, 0) / aceleraciones.length;
    const aceleracionMax = Math.max(...aceleraciones);
    const aceleracionMin = Math.min(...aceleraciones);
    
    // Estadísticas de temperatura
    const temperaturas = data.map(d => d.temperatura);
    const temperaturaPromedio = temperaturas.reduce((a, b) => a + b, 0) / temperaturas.length;
    
    // Niveles de riesgo
    const peligrosos = data.filter(d => d.aceleracion >= 2.0).length;
    const precaucion = data.filter(d => d.aceleracion >= 1.5 && d.aceleracion < 2.0).length;
    const seguros = data.filter(d => d.aceleracion < 1.5).length;
    
    return {
        totalRegistros,
        totalUsuarios: usuarios.length,
        usuarios,
        aceleracion: {
            promedio: aceleracionPromedio.toFixed(2),
            maxima: aceleracionMax.toFixed(2),
            minima: aceleracionMin.toFixed(2)
        },
        temperatura: {
            promedio: temperaturaPromedio.toFixed(2)
        },
        riesgo: {
            peligrosos,
            precaucion,
            seguros,
            porcentajePeligroso: ((peligrosos / totalRegistros) * 100).toFixed(1),
            porcentajePrecaucion: ((precaucion / totalRegistros) * 100).toFixed(1),
            porcentajeSeguro: ((seguros / totalRegistros) * 100).toFixed(1)
        }
    };
}

// Análisis por usuario específico
export function analyzeByUser(data: DeviceData[], usuario: string) {
    const userData = data.filter(d => d.usuario === usuario);
    
    if (userData.length === 0) {
        return null;
    }
    
    const aceleraciones = userData.map(d => d.aceleracion);
    const aceleracionPromedio = aceleraciones.reduce((a, b) => a + b, 0) / aceleraciones.length;
    
    const peligrosos = userData.filter(d => d.aceleracion >= 2.0).length;
    const precaucion = userData.filter(d => d.aceleracion >= 1.5 && d.aceleracion < 2.0).length;
    const seguros = userData.filter(d => d.aceleracion < 1.5).length;
    
    // Días más activos
    const diasCount: Record<string, number> = {};
    userData.forEach(d => {
        diasCount[d.dia] = (diasCount[d.dia] || 0) + 1;
    });
    const diaMasActivo = Object.entries(diasCount).sort((a, b) => b[1] - a[1])[0];
    
    // Horarios más activos
    const horariosCount: Record<string, number> = {};
    userData.forEach(d => {
        const rango = getHourRange(d.hora);
        horariosCount[rango] = (horariosCount[rango] || 0) + 1;
    });
    const horarioMasActivo = Object.entries(horariosCount).sort((a, b) => b[1] - a[1])[0];
    
    return {
        usuario,
        totalRegistros: userData.length,
        aceleracionPromedio: aceleracionPromedio.toFixed(2),
        nivelRiesgo: getRiskLevel(aceleracionPromedio),
        email: userData[0].email,
        distribucionRiesgo: {
            peligrosos,
            precaucion,
            seguros
        },
        diaMasActivo: diaMasActivo ? `${diaMasActivo[0]} (${diaMasActivo[1]} registros)` : 'N/A',
        horarioMasActivo: horarioMasActivo ? `${horarioMasActivo[0]} (${horarioMasActivo[1]} registros)` : 'N/A'
    };
}

// Análisis por día
export function analyzeByDay(data: DeviceData[], dia: string) {
    const dayData = data.filter(d => d.dia === dia);
    
    if (dayData.length === 0) {
        return null;
    }
    
    const aceleraciones = dayData.map(d => d.aceleracion);
    const aceleracionPromedio = aceleraciones.reduce((a, b) => a + b, 0) / aceleraciones.length;
    
    const peligrosos = dayData.filter(d => d.aceleracion >= 2.0).length;
    const precaucion = dayData.filter(d => d.aceleracion >= 1.5 && d.aceleracion < 2.0).length;
    const seguros = dayData.filter(d => d.aceleracion < 1.5).length;
    
    const usuariosActivos = [...new Set(dayData.map(d => d.usuario))];
    
    return {
        dia,
        totalRegistros: dayData.length,
        usuariosActivos: usuariosActivos.length,
        aceleracionPromedio: aceleracionPromedio.toFixed(2),
        distribucionRiesgo: {
            peligrosos,
            precaucion,
            seguros
        }
    };
}

// Análisis por horario
export function analyzeByTimeRange(data: DeviceData[], rangoHora: string) {
    const timeData = data.filter(d => getHourRange(d.hora) === rangoHora);
    
    if (timeData.length === 0) {
        return null;
    }
    
    const aceleraciones = timeData.map(d => d.aceleracion);
    const aceleracionPromedio = aceleraciones.reduce((a, b) => a + b, 0) / aceleraciones.length;
    
    const peligrosos = timeData.filter(d => d.aceleracion >= 2.0).length;
    
    return {
        rangoHora,
        totalRegistros: timeData.length,
        aceleracionPromedio: aceleracionPromedio.toFixed(2),
        registrosPeligrosos: peligrosos,
        nivelRiesgo: getRiskLevel(aceleracionPromedio)
    };
}

// Comparar usuarios
export function compareUsers(data: DeviceData[], usuarios: string[]) {
    return usuarios.map(usuario => {
        const userData = data.filter(d => d.usuario === usuario);
        const aceleraciones = userData.map(d => d.aceleracion);
        const aceleracionPromedio = aceleraciones.reduce((a, b) => a + b, 0) / aceleraciones.length;
        
        return {
            usuario,
            registros: userData.length,
            aceleracionPromedio: aceleracionPromedio.toFixed(2),
            nivelRiesgo: getRiskLevel(aceleracionPromedio)
        };
    }).sort((a, b) => parseFloat(a.aceleracionPromedio) - parseFloat(b.aceleracionPromedio));
}

// Top conductores más seguros
export function getTopSafeDrivers(data: DeviceData[], limit: number = 5) {
    const usuarios = [...new Set(data.map(d => d.usuario))];
    const userStats = usuarios.map(usuario => {
        const userData = data.filter(d => d.usuario === usuario);
        const aceleraciones = userData.map(d => d.aceleracion);
        const aceleracionPromedio = aceleraciones.reduce((a, b) => a + b, 0) / aceleraciones.length;
        
        return {
            usuario,
            aceleracionPromedio: parseFloat(aceleracionPromedio.toFixed(2)),
            registros: userData.length
        };
    });
    
    return userStats
        .sort((a, b) => a.aceleracionPromedio - b.aceleracionPromedio)
        .slice(0, limit);
}

// Top conductores más peligrosos
export function getTopDangerousDrivers(data: DeviceData[], limit: number = 5) {
    const usuarios = [...new Set(data.map(d => d.usuario))];
    const userStats = usuarios.map(usuario => {
        const userData = data.filter(d => d.usuario === usuario);
        const aceleraciones = userData.map(d => d.aceleracion);
        const aceleracionPromedio = aceleraciones.reduce((a, b) => a + b, 0) / aceleraciones.length;
        
        return {
            usuario,
            aceleracionPromedio: parseFloat(aceleracionPromedio.toFixed(2)),
            registros: userData.length
        };
    });
    
    return userStats
        .sort((a, b) => b.aceleracionPromedio - a.aceleracionPromedio)
        .slice(0, limit);
}

// Generar reporte completo en texto
export function generateFullReport(data: DeviceData[]): string {
    const general = analyzeAllData(data);
    const topSafe = getTopSafeDrivers(data, 3);
    const topDanger = getTopDangerousDrivers(data, 3);
    
    return `📊 REPORTE COMPLETO DE CONDUCCIÓN - PAY$AFE

📈 ESTADÍSTICAS GENERALES:
- Total de registros: ${general.totalRegistros}
- Usuarios monitoreados: ${general.totalUsuarios}
- Aceleración promedio: ${general.aceleracion.promedio}g
- Temperatura promedio: ${general.temperatura.promedio}°C

⚠️ DISTRIBUCIÓN DE RIESGO:
- 🔴 Peligroso: ${general.riesgo.peligrosos} registros (${general.riesgo.porcentajePeligroso}%)
- 🟡 Precaución: ${general.riesgo.precaucion} registros (${general.riesgo.porcentajePrecaucion}%)
- 🟢 Seguro: ${general.riesgo.seguros} registros (${general.riesgo.porcentajeSeguro}%)

🏆 TOP 3 CONDUCTORES MÁS SEGUROS:
${topSafe.map((u, i) => `${i + 1}. ${u.usuario} - ${u.aceleracionPromedio}g promedio`).join('\n')}

⚠️ TOP 3 CONDUCTORES CON MAYOR RIESGO:
${topDanger.map((u, i) => `${i + 1}. ${u.usuario} - ${u.aceleracionPromedio}g promedio`).join('\n')}

💡 RECOMENDACIONES:
- ${parseFloat(general.riesgo.porcentajePeligroso) > 30 ? 'Alta incidencia de conducción peligrosa. Se recomienda capacitación.' : 'Nivel de seguridad general aceptable.'}
- Los conductores seguros pueden ganar hasta 150 SafeCoins/semana
- Se recomienda revisar patrones de conducción en horarios de mayor riesgo`;
}
