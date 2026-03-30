import { useState, useEffect } from "react";
import {
  ChartColumn,
  X,
  ChevronDown,
  Building2,
  FileText,
  Upload,
  Palette,
  Download,
  Zap,
  FileDown,
  FileSpreadsheet,
  Check,
  Loader2
} from "lucide-react";
import { ReportsApiService } from "../services/reportsApi";
import { BuildingsApiService } from "../services/buildingsApi";
import { useModalScrollLock } from "./dashboard/GreenFinancial/componentes/ModalFrame";
import { CATEGORY_LIST } from "../constants/reports";
import type { GenerateReportPayload } from "../types/reports";
import type { LucideIcon } from "lucide-react";

interface ReportGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  buildingName?: string;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Building2,
  FileText,
  Zap,
  ChartColumn
};

export function ReportGeneratorModal({
  isOpen,
  onClose,
  onSuccess,
  buildingName = "Plaza Shopping",
}: ReportGeneratorModalProps) {
  useModalScrollLock(isOpen);
  const [categories, setCategories] = useState<any[]>([]);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(["general"]);
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set());
  const [selectedBuildings, setSelectedBuildings] = useState<Set<string>>(new Set());
  const [reportName, setReportName] = useState("");
  const [reportType, setReportType] = useState<"pdf" | "excel">("pdf");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [primaryColor, setPrimaryColor] = useState("#1e3a8a");
  const [secondaryColor, setSecondaryColor] = useState("#3b82f6");
  const [selectedCategory, setSelectedCategory] = useState<string>("general");
  
  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setIsLoadingData(true);
        try {
          // Fetch buildings and fields concurrently
          const [buildingsList, fData] = await Promise.all([
            BuildingsApiService.getAllBuildings(),
            ReportsApiService.getReportFields()
          ]);
          setBuildings(buildingsList);
          setCategories(fData);
          
          if (buildingsList.length > 0) {
             setSelectedBuildings(new Set([buildingsList[0].id]));
          }
        } catch (error) {
          console.error("Error fetching modal data:", error);
        } finally {
          setIsLoadingData(false);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleSection = (id: string) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const toggleField = (id: string) => {
    const next = new Set(selectedFields);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedFields(next);
  };

  const selectAllInCategory = (id: string) => {
    const category = categories.find((c) => c.id === id);
    if (!category) return;
    const next = new Set(selectedFields);
    const categoryFieldIds = category.fields.map((f: any) => f.id);
    const allSelected = categoryFieldIds.every((fid: string) => next.has(fid));

    if (allSelected) categoryFieldIds.forEach((fid: string) => next.delete(fid));
    else categoryFieldIds.forEach((fid: string) => next.add(fid));

    setSelectedFields(next);
  };

  const toggleBuilding = (id: string) => {
    const next = new Set(selectedBuildings);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedBuildings(next);
  };

  const totalCategoriesSelected = categories.filter((c) =>
    c.fields.some((f: any) => selectedFields.has(f.id)),
  ).length;

  const handleGenerate = async () => {
    if (!reportName.trim() || selectedBuildings.size === 0 || selectedFields.size === 0) {
      alert("Por favor completa el nombre, selecciona al menos un edificio y un campo.");
      return;
    }
    
    setIsGenerating(true);
    try {
      let logoBase64: string | undefined = undefined;
      if (logoFile) {
        logoBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(logoFile);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
        });
      }

      const payload: GenerateReportPayload = {
        title: reportName,
        buildingIds: Array.from(selectedBuildings),
        selectedFields: Array.from(selectedFields),
        format: reportType,
        category: selectedCategory,
        config: {
          primaryColor,
          secondaryColor,
          logoBase64
        }
      };
      
      await ReportsApiService.generateReport(payload);
      
      if (onSuccess) onSuccess();
      onClose(); // Close on success
      // Optionally trigger a refresh on the parent list
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Error al generar el informe. Intenta de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-2 md:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#1e3a8a]/10 to-[#1e3a8a]/5 flex-shrink-0">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] rounded-xl flex items-center justify-center shadow-lg">
              <ChartColumn className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Generador de Informes Personalizables
              </h3>
              <p className="text-sm text-gray-600">Edificio: {buildingName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 hover:bg-white/70 rounded-lg p-2 transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex min-h-0">
          {/* Left Column: Field Selection */}
          <div className="w-full md:w-3/5 border-r border-gray-200 flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex-shrink-0 bg-white">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Selecciona la Información a Incluir
              </h4>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#1e3a8a] text-white">
                  {selectedFields.size} campos seleccionados
                </span>
                <span>•</span>
                <span>
                  {totalCategoriesSelected} de {categories.length} categorías
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 bg-gray-50/30">
              {isLoadingData ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                  <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#1e3a8a]" />
                  <p>Cargando información...</p>
                </div>
              ) : categories.map((category) => {
                const isExpanded = expandedSections.includes(category.id);
                const Icon = ICON_MAP[category.icon] || FileText;
                const selectedInCat = category.fields.filter((f: any) =>
                  selectedFields.has(f.id),
                ).length;

                return (
                  <div
                    key={category.id}
                    className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white"
                  >
                    <div className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <button
                          onClick={() => toggleSection(category.id)}
                          className="flex items-center gap-2 flex-1 text-left min-w-0"
                        >
                          <ChevronDown
                            className={`w-4 h-4 text-gray-600 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                          />
                          <Icon className="w-4 h-4 text-[#1e3a8a] flex-shrink-0" />
                          <span className="text-sm font-semibold text-gray-900 truncate">
                            {category.title}
                          </span>
                        </button>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-blue-100 text-blue-700 font-medium">
                            {selectedInCat}/{category.fields.length}
                          </span>
                          <button
                            onClick={() => selectAllInCategory(category.id)}
                            className="text-xs text-[#1e3a8a] hover:underline whitespace-nowrap"
                          >
                            {selectedInCat === category.fields.length
                              ? "Deseleccionar todos"
                              : "Seleccionar todos"}
                          </button>
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-3 pt-0 space-y-2 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
                        {category.fields.map((field: any) => (
                          <label
                            key={field.id}
                            className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer group transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={selectedFields.has(field.id)}
                              onChange={() => toggleField(field.id)}
                              className="mt-1 w-4 h-4 rounded border-gray-300 text-[#1e3a8a] focus:ring-[#1e3a8a] focus:ring-2 cursor-pointer transition-all accent-[#1e3a8a]"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm text-gray-900 font-medium">
                                  {field.label}
                                </span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-medium uppercase tracking-wider">
                                  {field.type}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5">
                                Campo: <strong className="text-gray-700">{field.id}</strong>
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Personalization */}
          <div className="hidden md:flex md:w-2/5 flex-col overflow-hidden bg-white">
            <div className="px-6 py-4 border-b border-gray-100 flex-shrink-0">
              <h4 className="text-sm font-semibold text-gray-900">
                Personalización
              </h4>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              {/* Buildings selection */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" /> Edificios a Incluir *
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#1e3a8a] text-white text-[10px]">
                    {selectedBuildings.size} seleccionados
                  </span>
                </label>
                <div className="border border-gray-300 rounded-lg max-h-48 overflow-y-auto divide-y divide-gray-100 shadow-inner bg-gray-50/20">
                  {isLoadingData ? (
                    <div className="p-4 text-center text-sm text-gray-500">Cargando edificios...</div>
                  ) : buildings.map((b) => (
                    <label
                      key={b.id}
                      className="flex items-center gap-3 p-3 hover:bg-white cursor-pointer transition-colors group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBuildings.has(b.id)}
                        onChange={() => toggleBuilding(b.id)}
                        className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-[#1e3a8a]"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-[#1e3a8a] transition-colors">
                          {b.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {b.address}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700`}
                      >
                        {b.typology || 'Sin asignar'}
                      </span>
                    </label>
                  ))}
                </div>
                <p className="text-[10px] text-gray-500 mt-2">
                  Los campos seleccionados se exportarán para cada edificio
                  marcado
                </p>
              </div>

              {/* Form fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 text-left">
                    Nombre del Informe *
                  </label>
                  <input
                    type="text"
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                    placeholder="Ej: Informe Mensual Diciembre 2024"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none transition-all shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                    Categoría del Informe *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {CATEGORY_LIST.filter(cat => cat.id !== 'all').map((cat) => {
                      const Icon = cat.icon;
                      const isSelected = selectedCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all text-center gap-1.5 ${
                            isSelected
                              ? "border-[#1e3a8a] bg-[#1e3a8a]/5 shadow-sm"
                              : "border-gray-50 hover:border-gray-100 bg-gray-50/50"
                          }`}
                        >
                          <div className={`p-1.5 rounded-lg ${isSelected ? "bg-[#1e3a8a] text-white" : "bg-white text-gray-500 shadow-sm"}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className={`text-[10px] font-bold ${isSelected ? "text-[#1e3a8a]" : "text-gray-600"}`}>
                            {cat.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                    Tipo de Informe *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setReportType("pdf")}
                      className={`p-3 rounded-xl border-2 transition-all text-center ${
                        reportType === "pdf"
                          ? "border-[#1e3a8a] bg-[#1e3a8a]/5 shadow-sm"
                          : "border-gray-100 hover:border-gray-200 bg-white"
                      }`}
                    >
                      <FileDown
                        className={`w-6 h-6 mx-auto mb-1 ${reportType === "pdf" ? "text-[#1e3a8a]" : "text-gray-400"}`}
                      />
                      <p className="text-xs font-bold">PDF</p>
                      <p className="text-[10px] text-gray-500 leading-tight">
                        Digital / Impreso
                      </p>
                    </button>
                    <button
                      onClick={() => setReportType("excel")}
                      className={`p-3 rounded-xl border-2 transition-all text-center ${
                        reportType === "excel"
                          ? "border-green-600 bg-green-50 shadow-sm"
                          : "border-gray-100 hover:border-gray-200 bg-white"
                      }`}
                    >
                      <FileSpreadsheet
                        className={`w-6 h-6 mx-auto mb-1 ${reportType === "excel" ? "text-green-600" : "text-gray-400"}`}
                      />
                      <p className="text-xs font-bold">Excel</p>
                      <p className="text-[10px] text-gray-500 leading-tight">
                        Datos tabulares
                      </p>
                    </button>
                  </div>
                </div>

                <div>
                  {reportType === 'pdf' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5 text-left">Logo de la Empresa</label>
                      <label className="flex items-center justify-center gap-2 px-3 py-3 border-2 border-dashed border-gray-200 rounded-xl hover:border-[#1e3a8a] hover:bg-gray-50 cursor-pointer transition-all">
                        <Upload className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-600 font-medium">
                          {logoFile ? logoFile.name : "Subir Imagen Corporativa"}
                        </span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setLogoFile(file);
                          }}
                        />
                        {logoFile && <Check className="w-4 h-4 text-green-600" />}
                      </label>
                    </div>

                    <div className="space-y-4">
                      <label className="flex text-sm font-medium text-gray-700 items-center gap-2 text-left">
                        <Palette className="w-4 h-4 text-[#1e3a8a]" /> Colores Corporativos
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider text-left block">Primario</label>
                          <div className="flex items-center gap-2">
                            <input 
                              type="color" 
                              value={primaryColor} 
                              onChange={(e) => setPrimaryColor(e.target.value)} 
                              className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer overflow-hidden p-0" 
                            />
                            <span className="text-xs font-mono text-gray-500">{primaryColor}</span>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider text-left block">Secundario</label>
                          <div className="flex items-center gap-2">
                            <input 
                              type="color" 
                              value={secondaryColor} 
                              onChange={(e) => setSecondaryColor(e.target.value)} 
                              className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer overflow-hidden p-0" 
                            />
                            <span className="text-xs font-mono text-gray-500">{secondaryColor}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-in fade-in duration-300">
                    <div className="flex items-start gap-3 text-left">
                      <FileSpreadsheet className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <div>
                        <h5 className="text-sm font-semibold text-green-900 mb-1">Formato Excel</h5>
                        <p className="text-xs text-green-700 mb-2">El informe se generará como archivo Excel con los datos seleccionados en formato tabular.</p>
                        <ul className="text-xs text-green-700 space-y-1">
                          <li className="flex items-center gap-1">
                            <Check className="w-3 h-3 text-green-600" aria-hidden="true" />
                            Datos organizados en columnas
                          </li>
                          <li className="flex items-center gap-1">
                            <Check className="w-3 h-3 text-green-600" aria-hidden="true" />
                            Filtros automáticos habilitados
                          </li>
                          <li className="flex items-center gap-1">
                            <Check className="w-3 h-3 text-green-600" aria-hidden="true" />
                            Formato condicional aplicado
                          </li>
                          <li className="flex items-center gap-1">
                            <Check className="w-3 h-3 text-green-600" aria-hidden="true" />
                            Colores corporativos en encabezados
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> {selectedFields.size} campos
            </span>
            <span className="hidden sm:inline text-gray-300">|</span>
            <span className="flex items-center gap-1.5">
              {reportType === "pdf" ? (
                <FileDown className="w-4 h-4" />
              ) : (
                <FileSpreadsheet className="w-4 h-4" />
              )}
              Exportar como {reportType.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors border border-gray-200 bg-white"
            >
              Cancelar
            </button>
            <button
              onClick={handleGenerate}
              disabled={selectedFields.size === 0 || selectedBuildings.size === 0 || !reportName.trim() || isGenerating}
              className="px-6 py-2 text-sm font-bold text-white bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] hover:from-[#1e40af] hover:to-[#1e3a8a] rounded-lg transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isGenerating ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Generando...</>
              ) : (
                <><Download className="w-4 h-4" /> Generar Informe</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
