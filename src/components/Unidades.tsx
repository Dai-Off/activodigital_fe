export default function Unidades() {
  return (
    <div className="section animate-fadeInUp">
      <h2 className="text-2xl font-semibold text-gray-900 tracking-tight mb-6">Gestión de Unidades</h2>
      
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h6"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Gestión de Unidades</h3>
          <p className="text-gray-600 mb-6">
            Esta sección está disponible para la gestión de las 24 viviendas del edificio.
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Próximamente
          </button>
        </div>
      </div>
    </div>
  );
}
