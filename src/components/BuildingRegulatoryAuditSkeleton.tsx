import { Scale } from 'lucide-react';

export default function BuildingRegulatoryAuditSkeleton() {
  return (
    <div className="h-full flex flex-col gap-3 md:gap-4 animate-pulse">
      {/* Header */}
      <div className="bg-gray-200 rounded-xl p-4 md:p-6 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="p-2 md:p-3 bg-gray-300 rounded-xl flex-shrink-0">
            <Scale className="w-6 h-6 md:w-8 md:h-8 text-gray-400" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="h-6 md:h-8 bg-gray-300 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3 hidden sm:block"></div>
          </div>
        </div>
      </div>

      {/* 4 Top Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 flex-shrink-0">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-5">
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-200 rounded-lg"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="h-6 md:h-8 bg-gray-200 rounded w-10 mt-2"></div>
            <div className="h-3 bg-gray-200 rounded w-14 mt-2"></div>
          </div>
        ))}
      </div>

      {/* 2 Middle Cards (Estado Actual / Target) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 flex-shrink-0">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-3 md:p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="h-5 bg-gray-200 rounded w-32"></div>
              <div className="h-5 bg-gray-200 rounded-full w-16"></div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-32"></div>
              </div>
              <div>
                <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Bottom Section */}
      <div className="flex-1 overflow-auto pr-1">
        <div className="space-y-2 md:space-y-3">
          
          {/* Gap Analysis */}
          <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-3 md:p-4">
            <div className="h-5 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full w-full mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-40"></div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full w-full mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-40"></div>
              </div>
            </div>
          </div>

          {/* MEVs List */}
          <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-3 md:p-4">
            <div className="h-5 bg-gray-200 rounded w-64 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-gray-100 rounded-lg p-3">
                  <div className="flex justify-between mb-3">
                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                    <div className="h-5 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="h-16 bg-gray-50 rounded"></div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
