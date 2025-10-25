// Componente para visualizar la paleta de colores de Banorte
// Útil para desarrollo y testing de diseño

const BanorteColorPalette = () => {
  const colors = [
    {
      name: 'Banorte Yellow',
      hex: '#F8D44C',
      rgb: 'RGB(248, 212, 76)',
      className: 'bg-banorte-yellow',
      usage: 'CTAs, Bonificaciones, Acción'
    },
    {
      name: 'Banorte Yellow Light',
      hex: '#FBE89D',
      rgb: 'RGB(251, 232, 157)',
      className: 'bg-banorte-yellow-light',
      usage: 'Fondos suaves, hover states'
    },
    {
      name: 'Banorte Yellow Dark',
      hex: '#E5C23A',
      rgb: 'RGB(229, 194, 58)',
      className: 'bg-banorte-yellow-dark',
      usage: 'Hover en CTAs, énfasis'
    },
    {
      name: 'Banorte Blue (Cerúleo)',
      hex: '#108DCD',
      rgb: 'RGB(16, 141, 205)',
      className: 'bg-banorte-blue',
      usage: 'Headers, Navegación, Corporativo'
    },
    {
      name: 'Banorte Blue Light',
      hex: '#5CB3E0',
      rgb: 'RGB(92, 179, 224)',
      className: 'bg-banorte-blue-light',
      usage: 'Fondos claros, estados interactivos'
    },
    {
      name: 'Banorte Blue Dark',
      hex: '#0D6FA0',
      rgb: 'RGB(13, 111, 160)',
      className: 'bg-banorte-blue-dark',
      usage: 'Gradientes, footer, contraste'
    }
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Paleta de Colores Banorte
        </h1>
        <p className="text-gray-600 mb-8">
          Guía de colores corporativos para PaySafe
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {colors.map((color, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-gray-200"
            >
              <div className={`h-32 ${color.className}`} />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {color.name}
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">
                    <span className="font-semibold">HEX:</span> {color.hex}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">RGB:</span> {color.rgb}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Clase:</span>{' '}
                    <code className="bg-gray-100 px-2 py-1 rounded">
                      {color.className}
                    </code>
                  </p>
                  <p className="text-gray-700 mt-3 pt-3 border-t border-gray-200">
                    <span className="font-semibold">Uso:</span> {color.usage}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ejemplos de uso */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Ejemplos de Uso
          </h2>

          <div className="space-y-6">
            {/* Botones */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Botones (CTAs)</h3>
              <div className="flex gap-4 flex-wrap">
                <button className="bg-banorte-yellow hover:bg-banorte-yellow-dark text-gray-900 font-semibold px-6 py-3 rounded-lg transition-colors">
                  CTA Principal
                </button>
                <button className="bg-banorte-blue hover:bg-banorte-blue-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors">
                  CTA Secundario
                </button>
              </div>
            </div>

            {/* Badges */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Badges</h3>
              <div className="flex gap-3 flex-wrap">
                <span className="bg-banorte-yellow/20 text-banorte-yellow-dark px-4 py-2 rounded-full text-sm font-medium">
                  Nuevo
                </span>
                <span className="bg-banorte-blue/20 text-banorte-blue-dark px-4 py-2 rounded-full text-sm font-medium">
                  Verificado
                </span>
              </div>
            </div>

            {/* Gradientes */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Gradientes</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-banorte-yellow to-banorte-yellow-dark h-24 rounded-lg flex items-center justify-center text-gray-900 font-semibold">
                  Gradiente Amarillo
                </div>
                <div className="bg-gradient-to-r from-banorte-blue to-banorte-blue-dark h-24 rounded-lg flex items-center justify-center text-white font-semibold">
                  Gradiente Azul
                </div>
              </div>
            </div>

            {/* Texto */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Texto Destacado</h3>
              <p className="text-lg text-gray-700">
                Este es un ejemplo de{' '}
                <span className="text-banorte-blue font-semibold">
                  texto en azul Banorte
                </span>{' '}
                y otro con{' '}
                <span className="text-banorte-yellow font-semibold">
                  amarillo energía
                </span>
                .
              </p>
            </div>
          </div>
        </div>

        {/* Guía de accesibilidad */}
        <div className="mt-8 bg-blue-50 border-l-4 border-banorte-blue p-6 rounded">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            💡 Notas de Accesibilidad
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li>
              ✅ El amarillo Banorte (#F8D44C) debe usarse con texto oscuro
              para contraste adecuado
            </li>
            <li>
              ✅ El azul cerúleo (#108DCD) es seguro para texto blanco (cumple
              WCAG AA)
            </li>
            <li>
              ✅ Usar variantes dark para hover states mejora la visibilidad de
              interacción
            </li>
            <li>
              ✅ Tipografía: Helvetica, Verdana, Arial - alta legibilidad en
              pantalla
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BanorteColorPalette;