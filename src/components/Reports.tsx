import { useState, useEffect } from 'react';
import {
  ChartColumn,
  Plus,
  Zap,
  Building2,
  FileText,
  Clock,
  Download,
  Wrench,
  House,
  Search,
  Euro,
  FileDown,
  FileSpreadsheet,
  Loader2,
  Eye
} from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import { ReportGeneratorModal } from './ReportGeneratorModal';
import { ReportsApiService } from '../services/reportsApi';

const CATEGORY_MAP: Record<string, any> = {
  general: { label: 'General', icon: Building2, colorClass: 'bg-gray-100', iconColorClass: 'text-gray-600', badgeClass: 'bg-gray-100 text-gray-700 border-gray-200' },
  energy: { label: 'Energía', icon: Zap, colorClass: 'bg-green-100', iconColorClass: 'text-green-600', badgeClass: 'bg-green-100 text-green-700 border-green-200' },
  financial: { label: 'Financiero', icon: Euro, colorClass: 'bg-blue-100', iconColorClass: 'text-blue-600', badgeClass: 'bg-blue-100 text-blue-700 border-blue-200' },
  compliance: { label: 'Cumplimiento', icon: FileText, colorClass: 'bg-purple-100', iconColorClass: 'text-purple-600', badgeClass: 'bg-purple-100 text-purple-700 border-purple-200' },
  maintenance: { label: 'Mantenimiento', icon: Wrench, colorClass: 'bg-orange-100', iconColorClass: 'text-orange-600', badgeClass: 'bg-orange-100 text-orange-700 border-orange-200' },
  occupancy: { label: 'Ocupación', icon: House, colorClass: 'bg-yellow-100', iconColorClass: 'text-yellow-600', badgeClass: 'bg-yellow-100 text-yellow-700 border-yellow-200' }
};

export default function Reports() {
  const { activeSection, setActiveSection } = useNavigation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setActiveSection("all");
  }, []);
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const data = await ReportsApiService.getReports(activeSection);
      setReports(data || []);
    } catch (error) {
      console.error("Error fetching reports", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [activeSection]);

  const filteredReports = reports.filter(r =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white shadow-sm h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-3 md:px-6 pt-4 md:pt-6 pb-3 md:pb-5 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <ChartColumn className="w-5 h-5 md:w-6 md:h-6 text-blue-600" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-sm md:text-base text-gray-900">
              {activeSection === 'all' || !activeSection ? 'Todos los Informes' : (CATEGORY_MAP[activeSection]?.label || 'Informes')}
            </h2>
            <p className="text-xs md:text-sm text-gray-500">{filteredReports.length} informes disponibles</p>
          </div>
        </div>
        <div className="p-1.5 bg-white rounded-lg shadow-sm border border-gray-200">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Nuevo Informe</span>
          </button>
        </div>
      </div>

      <div className="px-3 md:px-6 py-3 md:py-4 border-b border-gray-100 flex-shrink-0">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
          <input
            type="text"
            placeholder="Buscar informes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto px-4 sm:px-6 py-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#1e3a8a]" />
            <p>Cargando informes...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <ChartColumn className="w-12 h-12 mb-4 opacity-20" />
            <p>No hay informes generados</p>
          </div>
        ) : (
          filteredReports.map((report) => {
            const uiProps = CATEGORY_MAP[report.category] || CATEGORY_MAP.general;
            const Icon = uiProps.icon;
            const isGenerating = report.status === 'generating';
            const dateStr = new Date(report.created_at).toLocaleDateString('es-ES');

            return (
              <div key={report.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`p-2.5 rounded-lg flex-shrink-0 ${uiProps.colorClass}`}>
                    <Icon className={`w-5 h-5 ${uiProps.iconColorClass}`} aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base text-gray-900 break-words flex items-center gap-2">
                       {report.title}
                       {isGenerating && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-yellow-100 text-yellow-800"><Loader2 className="w-3 h-3 animate-spin mr-1"/> Generando</span>}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{report.description || 'Informe generado desde el sistema'}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Building2 className="w-3 h-3" aria-hidden="true" />{report.building_ids?.length || 0} edificios</span>
                      <span className="text-gray-300">•</span>
                      <span className="flex items-center gap-1">{report.format === 'pdf' ? <FileDown className="w-3 h-3" /> : <FileSpreadsheet className="w-3 h-3" />} Formato {report.format ? report.format.toUpperCase() : 'PDF'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pl-11 sm:pl-0">
                  <div className="text-left sm:text-right flex-shrink-0">
                    <span className={`inline-flex items-center justify-center rounded-md px-2 py-0.5 font-medium text-xs border mb-1 ${uiProps.badgeClass}`}>
                      {uiProps.label}
                    </span>
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1 justify-end">
                      <Clock className="w-3 h-3" aria-hidden="true" />{dateStr}
                    </p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    {report.file_url ? (
                      <>
                        <a 
                          href={report.file_url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                          title="Ver informe"
                        >
                          <Eye className="w-4 h-4 text-gray-500" aria-hidden="true" />
                        </a>
                        <a 
                          href={`${report.file_url}${report.file_url.includes('?') ? '&' : '?'}download=`} 
                          className="p-2 hover:bg-green-50 rounded-lg transition-colors" 
                          title="Descargar"
                        >
                          <Download className="w-4 h-4 text-[#1e3a8a]" aria-hidden="true" />
                        </a>
                      </>
                    ) : (
                      <div className="flex gap-1">
                        <button disabled className="p-2 rounded-lg opacity-50 cursor-not-allowed" title="No disponible">
                          <Eye className="w-4 h-4 text-gray-300" aria-hidden="true" />
                        </button>
                        <button disabled className="p-2 rounded-lg opacity-50 cursor-not-allowed" title="No disponible">
                          <Download className="w-4 h-4 text-gray-300" aria-hidden="true" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <ReportGeneratorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchReports}
      />
    </div>
  );
}
