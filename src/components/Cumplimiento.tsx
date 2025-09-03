export default function Cumplimiento() {
  return (
    <div className="section animate-fadeInUp">
      <div className="flex justify-between items-center mb-6" style={{animation: 'fadeInUp 0.6s ease-out 0.1s both'}}>
        <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Cumplimiento Normativo</h2>
        <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <span className="inline-block">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M12 3l7 4v5c0 5.25-3.5 9.74-7 11-3.5-1.26-7-5.75-7-11V7l7-4z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </span>
          <span>Nuevo certificado</span>
        </button>
      </div>

      {/* Compliance Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Certificado CEE */}
        <div className="bg-white rounded-xl border border-gray-200 p-6" style={{animation: 'fadeInUp 0.6s ease-out 0.2s both'}}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Certificado CEE</h3>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Estado: <span className="text-green-600 font-medium">Vigente</span></p>
            <p className="text-sm text-gray-500">Vencimiento: 15/03/2034</p>
            <p className="text-sm text-gray-500">Calificación: B</p>
          </div>
          <button className="mt-4 w-full px-3 py-2 bg-gray-100 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">Ver certificado</button>
        </div>
        
        {/* Revisión RITE */}
        <div className="bg-white rounded-xl border border-gray-200 p-6" style={{animation: 'fadeInUp 0.6s ease-out 0.3s both'}}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Revisión RITE</h3>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Estado: <span className="text-yellow-600 font-medium">Próximo vencimiento</span></p>
            <p className="text-sm text-gray-500">Vencimiento: 20/05/2024</p>
            <p className="text-sm text-gray-500">Tipo: Inspección quinquenal</p>
          </div>
          <button className="mt-4 w-full px-3 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors">Programar inspección</button>
        </div>

        {/* Industria BT */}
        <div className="bg-white rounded-xl border border-gray-200 p-6" style={{animation: 'fadeInUp 0.6s ease-out 0.4s both'}}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Industria BT</h3>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Estado: <span className="text-green-600 font-medium">Vigente</span></p>
            <p className="text-sm text-gray-500">Vencimiento: 10/09/2029</p>
            <p className="text-sm text-gray-500">Instalador: ELECT-2024-001</p>
          </div>
          <button className="mt-4 w-full px-3 py-2 bg-gray-100 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">Ver boletín</button>
        </div>

        {/* Ascensor */}
        <div className="bg-white rounded-xl border border-gray-200 p-6" style={{animation: 'fadeInUp 0.6s ease-out 0.5s both'}}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Ascensor</h3>
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Estado: <span className="text-red-600 font-medium">Vencido</span></p>
            <p className="text-sm text-gray-500">Vencimiento: 15/04/2024</p>
            <p className="text-sm text-gray-500">Tipo: Revisión semestral</p>
          </div>
          <button className="mt-4 w-full px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">Acción requerida</button>
        </div>

        {/* PCI */}
        <div className="bg-white rounded-xl border border-gray-200 p-6" style={{animation: 'fadeInUp 0.6s ease-out 0.6s both'}}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">PCI</h3>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Estado: <span className="text-green-600 font-medium">Vigente</span></p>
            <p className="text-sm text-gray-500">Vencimiento: 30/11/2024</p>
            <p className="text-sm text-gray-500">Mantenedor: PCI-MANT-001</p>
          </div>
          <button className="mt-4 w-full px-3 py-2 bg-gray-100 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">Ver certificado</button>
        </div>

        {/* Accesibilidad */}
        <div className="bg-white rounded-xl border border-gray-200 p-6" style={{animation: 'fadeInUp 0.6s ease-out 0.7s both'}}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Accesibilidad</h3>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Estado: <span className="text-yellow-600 font-medium">En revisión</span></p>
            <p className="text-sm text-gray-500">Evaluación: Pendiente</p>
            <p className="text-sm text-gray-500">Normativa: CTE DB-SUA</p>
          </div>
          <button className="mt-4 w-full px-3 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors">Completar evaluación</button>
        </div>
      </div>

      {/* Compliance Timeline */}
      <div className="bg-white rounded-xl border border-gray-200 p-6" style={{animation: 'fadeInUp 0.6s ease-out 0.8s both'}}>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Cronograma de Vencimientos</h3>
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-4 h-4 bg-red-400 rounded-full mt-1"></div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Revisión ascensor - URGENTE</h4>
                  <p className="text-sm text-gray-500">Vencimiento: 15 de abril de 2024</p>
                </div>
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-md">3 días</span>
              </div>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-4 h-4 bg-yellow-400 rounded-full mt-1"></div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Inspección RITE</h4>
                  <p className="text-sm text-gray-500">Vencimiento: 20 de mayo de 2024</p>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-md">1 mes</span>
              </div>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-4 h-4 bg-blue-400 rounded-full mt-1"></div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Revisión PCI</h4>
                  <p className="text-sm text-gray-500">Vencimiento: 30 de noviembre de 2024</p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-md">7 meses</span>
              </div>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-4 h-4 bg-green-400 rounded-full mt-1"></div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Renovación CEE</h4>
                  <p className="text-sm text-gray-500">Vencimiento: 15 de marzo de 2034</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-md">10 años</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes fadeInUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}
