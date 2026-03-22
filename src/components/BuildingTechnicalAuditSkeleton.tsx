import { Wrench } from 'lucide-react';

export default function BuildingTechnicalAuditSkeleton() {
  return (
    <div className="h-full flex flex-col gap-4 animate-pulse">
      {/* Header */}
      <div className="bg-gray-200 rounded-xl p-6 shadow-lg flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gray-300 rounded-xl flex-shrink-0">
            <Wrench className="w-8 h-8 text-gray-400" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 hidden sm:block"></div>
          </div>
        </div>
      </div>

      {/* 2 Middle Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-shrink-0">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="h-5 bg-gray-200 rounded w-32"></div>
              <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between mb-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-10"></div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3"></div>
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-8"></div>
                </div>
                <div className="h-3 bg-gray-100 rounded w-48"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto pr-1">
        <div className="space-y-4">
          {/* Main Content Areas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="h-5 bg-gray-200 rounded w-64 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="border-l-4 border-gray-200 bg-gray-50 p-4 rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg mt-1 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-100 rounded w-full mb-1"></div>
                      <div className="h-3 bg-gray-100 rounded w-full mb-3"></div>
                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Impact 4 blocks */}
          <div className="bg-gray-50 rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="h-4 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="text-center bg-white rounded-lg p-3">
                  <div className="h-3 bg-gray-100 rounded w-24 mx-auto mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-16 mx-auto mb-1"></div>
                  <div className="h-3 bg-gray-100 rounded w-20 mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
