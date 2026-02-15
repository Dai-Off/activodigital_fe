import {
  Building2,
  CircleAlert,
  CircleCheck,
  Clock,
  LucideAward,
  LucideScale,
  LucideWrench,
  TriangleAlert,
} from "lucide-react";

const DataRoom = () => {
  return (
    <div>
      <div className="hidden md:flex items-center justify-end gap-3 md:gap-4">
        <div className="text-left md:text-right">
          <div className="text-[10px] md:text-xs text-gray-900">
            Completitud Dossier
          </div>
          <div className="text-base md:text-lg text-[#1e3a8a]">73%</div>
        </div>
        <button className="px-3 md:px-4 py-2 bg-[#1e3a8a] text-white rounded-lg hover:bg-blue-700 transition-colors text-xs md:text-sm flex items-center gap-2 whitespace-nowrap">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-download w-3 h-3 md:w-4 md:h-4"
            aria-hidden="true"
          >
            <path d="M12 15V3"></path>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <path d="m7 10 5 5 5-5"></path>
          </svg>
          <span className="hidden sm:inline">Descargar Dossier</span>
          <span className="sm:hidden">Descargar</span>
        </button>
      </div>
      <div className="hidden md:block bg-[#1e3a8a] text-white rounded-lg p-3 my-3 md:p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
          <div className="min-w-0">
            <h1 className="text-xs md:text-sm mb-0.5 truncate">
              Data Room - Edificio Residencial Gran Vía
            </h1>
            <p className="text-[10px] md:text-xs text-blue-200 truncate">
              Centro de documentación completo para financiación
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
        <div className="bg-white rounded-lg shadow border-2 border-gray-200 p-2 md:p-4">
          <p className="text-[10px] md:text-sm text-gray-600 mb-0.5 md:mb-1">
            Total Docs
          </p>
          <p className="text-lg md:text-2xl text-[#1e3a8a]">59</p>
        </div>
        <div className="bg-white rounded-lg shadow border-2 border-green-200 p-2 md:p-4">
          <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1">
            <CircleCheck
              className="w-3 h-3 md:w-4 md:h-4 text-green-600"
              aria-hidden="true"
            />
            <p className="text-[10px] md:text-sm text-gray-600">Verif.</p>
          </div>
          <p className="text-lg md:text-2xl text-green-600">43</p>
        </div>
        <div className="bg-white rounded-lg shadow border-2 border-orange-200 p-2 md:p-4">
          <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1">
            <Clock
              className="w-3 h-3 md:w-4 md:h-4 text-orange-600"
              aria-hidden="true"
            />
            <p className="text-[10px] md:text-sm text-gray-600">Revisión</p>
          </div>
          <p className="text-lg md:text-2xl text-orange-600">4</p>
        </div>
        <div className="bg-white rounded-lg shadow border-2 border-gray-200 p-2 md:p-4">
          <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1">
            <TriangleAlert
              className="w-3 h-3 md:w-4 md:h-4 text-gray-600"
              aria-hidden="true"
            />
            <p className="text-[10px] md:text-sm text-gray-600">Pend.</p>
          </div>
          <p className="text-lg md:text-2xl text-gray-600">12</p>
        </div>
        <div className="bg-white rounded-lg shadow border-2 border-red-200 p-2 md:p-4">
          <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1">
            <CircleAlert
              className="w-3 h-3 md:w-4 md:h-4 text-red-600"
              aria-hidden="true"
            />
            <p className="text-[10px] md:text-sm text-gray-600">Oblig.</p>
          </div>
          <p className="text-lg md:text-2xl text-red-600">47</p>
        </div>
        <div className="bg-white rounded-lg shadow border-2 border-[#1e3a8a] p-2 md:hidden">
          <p className="text-[10px] text-gray-600 mb-0.5">Complet.</p>
          <p className="text-lg text-[#1e3a8a]">73%</p>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-3 md:p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          <button className="p-2 md:p-4 rounded-lg border-2 transition-all text-left border-blue-600 bg-blue-50">
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3 min-w-0">
              <div className="p-1.5 md:p-2 rounded-lg bg-blue-100 text-blue-600 flex-shrink-0">
                <LucideWrench className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs md:text-sm text-gray-900 truncate">
                  Documentación Técnica
                </div>
                <div className="text-[10px] md:text-xs text-gray-600 whitespace-nowrap">
                  13 docs
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2">
              <div
                className="h-1.5 md:h-2 rounded-full bg-blue-600"
                style={{ width: "54%" }}
              ></div>
            </div>
            <div className="text-[10px] md:text-xs text-gray-600 mt-1">
              7/13 verif.
            </div>
          </button>
          <button className="p-2 md:p-4 rounded-lg border-2 transition-all text-left border-gray-200 hover:border-gray-300 hover:bg-gray-50">
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3 min-w-0">
              <div className="p-1.5 md:p-2 rounded-lg bg-purple-100 text-purple-600 flex-shrink-0">
                <LucideScale className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs md:text-sm text-gray-900 truncate">
                  Documentación Legal
                </div>
                <div className="text-[10px] md:text-xs text-gray-600 whitespace-nowrap">
                  10 docs
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2">
              <div
                className="h-1.5 md:h-2 rounded-full bg-purple-600"
                style={{ width: "100%" }}
              ></div>
            </div>
            <div className="text-[10px] md:text-xs text-gray-600 mt-1">
              10/10 verif.
            </div>
          </button>
          <button className="p-2 md:p-4 rounded-lg border-2 transition-all text-left border-gray-200 hover:border-gray-300 hover:bg-gray-50">
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3 min-w-0">
              <div className="p-1.5 md:p-2 rounded-lg bg-green-100 text-green-600 flex-shrink-0">
                <LucideAward className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs md:text-sm text-gray-900 truncate">
                  Documentación Financiera
                </div>
                <div className="text-[10px] md:text-xs text-gray-600 whitespace-nowrap">
                  28 docs
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2">
              <div
                className="h-1.5 md:h-2 rounded-full bg-green-600"
                style={{ width: "79%" }}
              ></div>
            </div>
            <div className="text-[10px] md:text-xs text-gray-600 mt-1">
              22/28 verif.
            </div>
          </button>
          <button className="p-2 md:p-4 rounded-lg border-2 transition-all text-left border-gray-200 hover:border-gray-300 hover:bg-gray-50">
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3 min-w-0">
              <div className="p-1.5 md:p-2 rounded-lg bg-orange-100 text-orange-600 flex-shrink-0">
                <LucideAward className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs md:text-sm text-gray-900 truncate">
                  Fiscal &amp; Subvenciones
                </div>
                <div className="text-[10px] md:text-xs text-gray-600 whitespace-nowrap">
                  8 docs
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2">
              <div
                className="h-1.5 md:h-2 rounded-full bg-orange-600"
                style={{ width: "50%" }}
              ></div>
            </div>
            <div className="text-[10px] md:text-xs text-gray-600 mt-1">
              4/8 verif.
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataRoom;
