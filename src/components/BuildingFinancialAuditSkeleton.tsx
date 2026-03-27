export default function BuildingFinancialAuditSkeleton() {
  return (
    <div className="h-full flex flex-col gap-4 animate-pulse">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl p-5 shadow-lg flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-400/20 rounded-lg">
            <div className="w-6 h-6 bg-gray-400 rounded"></div>
          </div>
          <div>
            <div className="h-6 bg-gray-400 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-400/70 rounded w-72 hidden sm:block"></div>
          </div>
        </div>
      </div>

      {/* Situación Financiera Actual - 4 Cards */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex-shrink-0">
        <div className="h-5 bg-gray-200 rounded w-48 mb-5"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`border-l-4 pl-4 p-3 rounded-r-lg ${
              i === 1 ? 'border-blue-200 bg-blue-50/30' : 
              i === 2 ? 'border-orange-200 bg-orange-50/30' : 
              i === 3 ? 'border-purple-200 bg-purple-50/30' : 
              'border-green-200 bg-green-50/30'
            }`}>
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-300 rounded w-32 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto pr-1">
        <div className="space-y-4">
          
          {/* Análisis de Mercado */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="h-5 bg-gray-200 rounded w-64 mb-5"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                  <div className="h-3 bg-gray-200 rounded w-24 mb-3"></div>
                  <div className="h-6 bg-gray-300 rounded w-20 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="h-3 bg-gray-200 rounded w-48 mb-3"></div>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-3 bg-gray-200 rounded w-full"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Proyección Financiera */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="h-5 bg-gray-200 rounded w-64 mb-5"></div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-gray-50 border-2 border-gray-100 rounded-xl p-4">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="h-3 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="pt-3 border-t-2 border-gray-200 flex justify-between">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-5 bg-gray-300 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-gray-100 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-3 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-8 bg-gray-300 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-40"></div>
                </div>
                <div className="text-right">
                  <div className="h-3 bg-gray-200 rounded w-32 mb-2 ml-auto"></div>
                  <div className="h-8 bg-gray-300 rounded w-16 mb-2 ml-auto"></div>
                  <div className="h-3 bg-gray-200 rounded w-24 ml-auto"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Comparativa Escenarios */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
             <div className="h-5 bg-gray-200 rounded w-64 mb-5"></div>
             <div className="grid grid-cols-5 gap-3">
               {[1, 2, 3, 4, 5].map((i) => (
                 <div key={i} className="bg-gray-50 rounded-lg p-3 border-2 border-gray-100">
                    <div className="flex flex-col items-center mb-3">
                      <div className="h-3 bg-gray-200 rounded w-16 mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="space-y-2">
                      {[1, 2, 3, 4, 5, 6].map((j) => (
                        <div key={j} className="bg-white rounded p-2">
                          <div className="h-2 bg-gray-200 rounded w-16 mb-1"></div>
                          <div className="h-3 bg-gray-300 rounded w-12"></div>
                        </div>
                      ))}
                    </div>
                 </div>
               ))}
             </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
