import {
  Building2,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  Clock,
  Download,
  Info,
  LucideAward,
  LucideScale,
  LucideWrench,
  TriangleAlert,
  Upload,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import DocumentItem from "./componentes/DocumentItem";

const DataRoom = () => {
  const { t } = useTranslation();

  interface Category {
    id: string;
    name: string;
    icon: typeof Building2;
    guide: string;
    color: string;
    mandatory: number;
    verified: number;
    optional: number;
    subcategories: number;
  }

  const categories: Category[] = [
    {
      id: "technical",
      name: t("dataRoom.technicalDocs"),
      icon: LucideWrench,
      guide: t("dataRoom.guideTechnical"),
      color: "blue",
      mandatory: 10,
      verified: 7,
      optional: 2,
      subcategories: 5,
    },
    {
      id: "legal",
      name: t("dataRoom.legalDocs"),
      icon: LucideScale,
      guide: t("dataRoom.guideLegal"),
      color: "purple",
      mandatory: 9,
      verified: 10,
      optional: 1,
      subcategories: 4,
    },
    {
      id: "financial",
      name: t("dataRoom.financialDocs"),
      icon: LucideAward,
      guide: t("dataRoom.guideFinancial"),
      color: "green",
      mandatory: 25,
      verified: 22,
      optional: 3,
      subcategories: 6,
    },
    {
      id: "fiscal",
      name: t("dataRoom.fiscalDocs"),
      icon: LucideAward,
      guide: t("dataRoom.guideFiscal"),
      color: "orange",
      mandatory: 2,
      verified: 4,
      optional: 6,
      subcategories: 4,
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState<Category>(
    categories[0],
  );

  const handleCategorySelect = (id: string) => {
    setSelectedCategory(categories.find((category) => category.id === id)!);
  };

  return (
    <div>
      <div className="hidden md:flex items-center justify-end gap-3 md:gap-4">
        <div className="text-left md:text-right">
          <div className="text-[10px] md:text-xs text-gray-900">
            {t("dataRoom.dossierCompletion")}
          </div>
          <div className="text-base md:text-lg text-[#1e3a8a]">73%</div>
        </div>
        <button className="px-3 md:px-4 py-2 bg-[#1e3a8a] text-white rounded-lg hover:bg-blue-700 transition-colors text-xs md:text-sm flex items-center gap-2 whitespace-nowrap">
          <Download
            className="lucide lucide-download w-3 h-3 md:w-4 md:h-4"
            aria-hidden="true"
          />
          <span className="hidden sm:inline">
            {t("dataRoom.downloadDossier")}
          </span>
          <span className="sm:hidden">{t("dataRoom.download")}</span>
        </button>
      </div>
      <div className="hidden md:block bg-[#1e3a8a] text-white rounded-lg p-3 my-3 md:p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
          <div className="min-w-0">
            <h1 className="text-xs md:text-sm mb-0.5 truncate">
              {t("dataRoom.title")}
            </h1>
            <p className="text-[10px] md:text-xs text-blue-200 truncate">
              {t("dataRoom.subtitle")}
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
        <div className="bg-white rounded-lg shadow border-2 border-gray-200 p-2 md:p-4">
          <p className="text-[10px] md:text-sm text-gray-600 mb-0.5 md:mb-1">
            {t("dataRoom.totalDocs")}
          </p>
          <p className="text-lg md:text-2xl text-[#1e3a8a]">0</p>
        </div>
        <div className="bg-white rounded-lg shadow border-2 border-green-200 p-2 md:p-4">
          <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1">
            <CircleCheck
              className="w-3 h-3 md:w-4 md:h-4 text-green-600"
              aria-hidden="true"
            />
            <p className="text-[10px] md:text-sm text-gray-600">
              {t("dataRoom.verified")}
            </p>
          </div>
          <p className="text-lg md:text-2xl text-green-600">0</p>
        </div>
        <div className="bg-white rounded-lg shadow border-2 border-orange-200 p-2 md:p-4">
          <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1">
            <Clock
              className="w-3 h-3 md:w-4 md:h-4 text-orange-600"
              aria-hidden="true"
            />
            <p className="text-[10px] md:text-sm text-gray-600">
              {t("dataRoom.review")}
            </p>
          </div>
          <p className="text-lg md:text-2xl text-orange-600">0</p>
        </div>
        <div className="bg-white rounded-lg shadow border-2 border-gray-200 p-2 md:p-4">
          <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1">
            <TriangleAlert
              className="w-3 h-3 md:w-4 md:h-4 text-gray-600"
              aria-hidden="true"
            />
            <p className="text-[10px] md:text-sm text-gray-600">
              {t("dataRoom.pending")}
            </p>
          </div>
          <p className="text-lg md:text-2xl text-gray-600">0</p>
        </div>
        <div className="bg-white rounded-lg shadow border-2 border-red-200 p-2 md:p-4">
          <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1">
            <CircleAlert
              className="w-3 h-3 md:w-4 md:h-4 text-red-600"
              aria-hidden="true"
            />
            <p className="text-[10px] md:text-sm text-gray-600">
              {t("dataRoom.obligatory")}
            </p>
          </div>
          <p className="text-lg md:text-2xl text-red-600">0</p>
        </div>
        <div className="bg-white rounded-lg shadow border-2 border-[#1e3a8a] p-2 md:hidden">
          <p className="text-[10px] text-gray-600 mb-0.5">
            {t("dataRoom.completion")}
          </p>
          <p className="text-lg text-[#1e3a8a]">73%</p>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 my-3 md:my-6 p-3 md:p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          <button
            className={
              "p-2 md:p-4 rounded-lg transition-all text-left border-2 " +
              (selectedCategory.id === "technical"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200")
            }
            onClick={() => handleCategorySelect("technical")}
          >
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3 min-w-0">
              <div className="p-1.5 md:p-2 rounded-lg bg-blue-100 text-blue-600 flex-shrink-0">
                <LucideWrench className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs md:text-sm text-gray-900 truncate">
                  {t("dataRoom.technicalDocs")}
                </div>
                <div className="text-[10px] md:text-xs text-gray-600 whitespace-nowrap">
                  {categories[0].mandatory +
                    categories[0].optional +
                    " " +
                    t("dataRoom.docsCount")}
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2">
              <div
                className="h-1.5 md:h-2 rounded-full bg-blue-600"
                style={{
                  width: `${(categories[0].verified / (categories[0].mandatory + categories[0].optional)) * 100}%`,
                }}
              ></div>
            </div>
            <div className="text-[10px] md:text-xs text-gray-600 mt-1">
              {t("dataRoom.verifCount", {
                verif: categories[0].verified,
                total: categories[0].mandatory + categories[0].optional,
              })}
            </div>
          </button>
          <button
            className={
              "p-2 md:p-4 rounded-lg border-2 transition-all text-left " +
              (selectedCategory.id === "legal"
                ? "border-purple-600 bg-purple-50"
                : "border-gray-200 hover:bg-gray-50")
            }
            onClick={() => handleCategorySelect("legal")}
          >
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3 min-w-0">
              <div className="p-1.5 md:p-2 rounded-lg bg-purple-100 text-purple-600 flex-shrink-0">
                <LucideScale className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs md:text-sm text-gray-900 truncate">
                  {t("dataRoom.legalDocs")}
                </div>
                <div className="text-[10px] md:text-xs text-gray-600 whitespace-nowrap">
                  {categories[1].mandatory +
                    categories[1].optional +
                    " " +
                    t("dataRoom.docsCount")}
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2">
              <div
                className="h-1.5 md:h-2 rounded-full bg-purple-600"
                style={{
                  width: `${(categories[1].verified / (categories[1].mandatory + categories[1].optional)) * 100}%`,
                }}
              ></div>
            </div>
            <div className="text-[10px] md:text-xs text-gray-600 mt-1">
              {t("dataRoom.verifCount", {
                verif: categories[1].verified,
                total: categories[1].mandatory + categories[1].optional,
              })}
            </div>
          </button>
          <button
            className={
              "p-2 md:p-4 rounded-lg border-2 transition-all text-left " +
              (selectedCategory.id === "financial"
                ? "border-green-600 bg-green-50"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50")
            }
            onClick={() => handleCategorySelect("financial")}
          >
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3 min-w-0">
              <div className="p-1.5 md:p-2 rounded-lg bg-green-100 text-green-600 flex-shrink-0">
                <LucideAward className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs md:text-sm text-gray-900 truncate">
                  {t("dataRoom.financialDocs")}
                </div>
                <div className="text-[10px] md:text-xs text-gray-600 whitespace-nowrap">
                  {categories[2].mandatory +
                    categories[2].optional +
                    " " +
                    t("dataRoom.docsCount")}
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2">
              <div
                className="h-1.5 md:h-2 rounded-full bg-green-600"
                style={{
                  width: `${(categories[2].verified / (categories[2].mandatory + categories[2].optional)) * 100}%`,
                }}
              ></div>
            </div>
            <div className="text-[10px] md:text-xs text-gray-600 mt-1">
              {t("dataRoom.verifCount", {
                verif: categories[2].verified,
                total: categories[2].mandatory + categories[2].optional,
              })}
            </div>
          </button>
          <button
            className={
              "p-2 md:p-4 rounded-lg border-2 transition-all text-left " +
              (selectedCategory.id === "fiscal"
                ? "border-orange-600 bg-orange-50"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50")
            }
            onClick={() => handleCategorySelect("fiscal")}
          >
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3 min-w-0">
              <div className="p-1.5 md:p-2 rounded-lg bg-orange-100 text-orange-600 flex-shrink-0">
                <LucideAward className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs md:text-sm text-gray-900 truncate">
                  {t("dataRoom.fiscalDocs")}
                </div>
                <div className="text-[10px] md:text-xs text-gray-600 whitespace-nowrap">
                  {categories[3].mandatory +
                    categories[3].optional +
                    " " +
                    t("dataRoom.docsCount")}
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2">
              <div
                className="h-1.5 md:h-2 rounded-full bg-orange-600"
                style={{
                  width: `${(categories[3].verified / (categories[3].mandatory + categories[3].optional)) * 100}%`,
                }}
              ></div>
            </div>
            <div className="text-[10px] md:text-xs text-gray-600 mt-1">
              {t("dataRoom.verifCount", {
                verif: categories[3].verified,
                total: categories[3].mandatory + categories[3].optional,
              })}
            </div>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-6">
        <div className="lg:col-span-8 space-y-3 md:space-y-4">
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-3 md:p-6">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="flex items-center gap-2 md:gap-3 min-w-0">
                <div
                  className={`p-2 md:p-3 rounded-lg bg-${selectedCategory.color}-100 text-${selectedCategory.color}-600 flex-shrink-0`}
                >
                  <selectedCategory.icon />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm md:text-lg text-gray-900 truncate">
                    {selectedCategory.name}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 truncate">
                    {t("dataRoom.verifDocsStatus", {
                      verif: selectedCategory.verified,
                      total:
                        selectedCategory.mandatory + selectedCategory.optional,
                    })}
                  </p>
                </div>
              </div>
            </div>
            <div className="border-2 border-dashed rounded-xl p-4 md:p-8 mb-4 md:mb-6 transition-all border-gray-300 hover:border-gray-400 hover:bg-gray-50">
              <div className="flex flex-col items-center justify-center gap-2 md:gap-3">
                <Upload
                  className="lucide lucide-upload w-8 h-8 md:w-12 md:h-12 text-gray-400"
                  aria-hidden="true"
                />
                <div className="text-center">
                  <p className="text-xs md:text-sm text-gray-900 mb-0.5 md:mb-1">
                    <span className="hidden sm:inline">
                      {t("dataRoom.dragAndDrop")}
                    </span>
                    <span className="sm:hidden">
                      {t("dataRoom.dragAndDropShort")}
                    </span>
                  </p>
                  <p className="text-[10px] md:text-xs text-gray-600">
                    {t("dataRoom.fileLimits")}
                  </p>
                </div>
                <button className="px-3 md:px-4 py-1.5 md:py-2 bg-[#1e3a8a] text-white rounded-lg hover:bg-blue-700 transition-colors text-xs md:text-sm">
                  {t("dataRoom.selectFiles")}
                </button>
              </div>
            </div>
            <div id="containerDocuments" className="space-y-2 md:space-y-3">
              {/* Caso 1: Documento pendiente y obligatorio */}
              <DocumentItem
                id="dnsh"
                title={t("dataRoom.dnshJustification")}
                description={t("dataRoom.dnshJustificationDesc")}
                status="pending"
                isObligatory={true}
              />

              {/* Caso 2: Documento en revisión/validándose */}
              <DocumentItem
                id="licencia"
                title={t("dataRoom.buildingLicense")}
                description={t("dataRoom.buildingLicenseDesc")}
                status="review"
                isObligatory={true}
              />

              {/* Caso 3: Documento verificado sin datos extraídos */}
              <DocumentItem
                id="seguridad"
                title={t("dataRoom.safetyStudy")}
                description={t("dataRoom.safetyStudyDesc")}
                status="verified"
                isObligatory={true}
                metadata={{
                  filename: "ESS_Rehabilitacion.pdf",
                  size: "3.8 MB",
                  date: "22/11/2024",
                }}
              />

              {/* Caso 4: Documento verificado con datos extraídos */}
              <DocumentItem
                id="pem"
                title={t("dataRoom.pem")}
                description={t("dataRoom.pemDesc")}
                status="verified"
                isObligatory={true}
                metadata={{
                  filename: "Presupuesto_Detallado.xlsx",
                  size: "1.2 MB",
                  date: "18/11/2024",
                }}
                extractedData={[
                  { label: "Total", value: "1.500.000€" },
                  { label: "Partidas", value: "127" },
                  { label: "Validación", value: "CYPE" },
                ]}
              />

              {/* Caso 5: Documento rechazado */}
              <DocumentItem
                id="ite"
                title={t("dataRoom.iteReport")}
                description={t("dataRoom.iteReportDesc")}
                status="rejected"
                isObligatory={true}
                metadata={{
                  filename: "ite_caducada.pdf",
                  size: "5.6 MB",
                  date: "10/01/2024",
                }}
              />
            </div>
          </div>
        </div>
        <div className="lg:col-span-4 space-y-3 md:space-y-4">
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-3 md:p-6">
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-sm text-gray-900 mb-0.5">
                      {t("dataRoom.guideTitle")}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {t("dataRoom.guideTechnical")}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl text-blue-600">
                      {selectedCategory.mandatory + selectedCategory.optional}
                    </div>
                    <div className="text-xs text-gray-600">
                      {t("dataRoom.totalDocuments")}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <div className="text-xs text-gray-600 mb-1">
                      {t("dataRoom.obligatoryItems")}
                    </div>
                    <div className="text-xl text-red-600">
                      {selectedCategory.mandatory}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <div className="text-xs text-gray-600 mb-1">
                      {t("dataRoom.optionalItems")}
                    </div>
                    <div className="text-xl text-gray-600">
                      {selectedCategory.optional}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <div className="text-xs text-gray-600 mb-1">
                      {t("dataRoom.categoriesCount")}
                    </div>
                    <div className="text-xl text-blue-600">
                      {selectedCategory.subcategories}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <ChevronRight className=" w-5 h-5 text-gray-400" />
                      <div className="text-left">
                        <h4 className="text-sm text-gray-900 mb-0.5">
                          {t("dataRoom.energyCertsTitle")}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {t("dataRoom.energyCertsDesc")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-gray-600">
                          {2} {t("dataRoom.docsCount", { count: 2 })}
                        </div>
                        <div className="text-xs text-red-600">
                          {2} {t("dataRoom.obligatoryItems")}
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <ChevronRight className=" w-5 h-5 text-gray-400" />
                      <div className="text-left">
                        <h4 className="text-sm text-gray-900 mb-0.5">
                          {t("dataRoom.projectsAndMemories")}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {t("dataRoom.projectsAndMemoriesDesc")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-gray-600">
                          {3} {t("dataRoom.docsCount", { count: 3 })}
                        </div>
                        <div className="text-xs text-red-600">
                          {3} {t("dataRoom.obligatoryItems")}
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <ChevronRight className=" w-5 h-5 text-gray-400" />
                      <div className="text-left">
                        <h4 className="text-sm text-gray-900 mb-0.5">
                          {t("dataRoom.safetyAndEnvironment")}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {t("dataRoom.safetyAndEnvironmentDesc")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-gray-600">
                          {3} {t("dataRoom.docsCount", { count: 3 })}
                        </div>
                        <div className="text-xs text-red-600">
                          {3} {t("dataRoom.obligatoryItems")}
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <ChevronRight className=" w-5 h-5 text-gray-400" />
                      <div className="text-left">
                        <h4 className="text-sm text-gray-900 mb-0.5">
                          {t("dataRoom.adminDocs")}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {t("dataRoom.adminDocsDesc")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-gray-600">
                          {3} {t("dataRoom.docsCount", { count: 3 })}
                        </div>
                        <div className="text-xs text-red-600">
                          {2} {t("dataRoom.obligatoryItems")}
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <ChevronRight
                        className="lucide lucide-chevron-right w-5 h-5 text-gray-400"
                        aria-hidden="true"
                      />
                      <div className="text-left">
                        <h4 className="text-sm text-gray-900 mb-0.5">
                          {t("dataRoom.complementaryStudies")}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {t("dataRoom.complementaryStudiesDesc")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-gray-600">
                          {1} {t("dataRoom.docsCount", { count: 1 })}
                        </div>
                        <div className="text-xs text-red-600">
                          {0} {t("dataRoom.obligatoryItems")}
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Download
                    className="lucide lucide-download w-6 h-6 text-green-600 mt-1 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm text-gray-900 mb-2">
                      {t("dataRoom.downloadChecklistTitle")}
                    </h4>
                    <p className="text-xs text-gray-700 mb-3">
                      {t("dataRoom.downloadChecklistDesc")}
                    </p>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2">
                      <Download
                        className="lucide lucide-download w-4 h-4"
                        aria-hidden="true"
                      />
                      <span className="hidden sm:inline">
                        {t("dataRoom.downloadChecklistBtn")}
                      </span>
                      <span className="sm:hidden">
                        {t("dataRoom.download")}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm text-gray-900 mb-2">
                      {t("dataRoom.importantNotes")}
                    </h4>
                    <ul className="space-y-1 text-xs text-gray-700">
                      <li>
                        • <strong>CEE:</strong>{" "}
                        {t("dataRoom.noteCEE").replace("CEE: ", "")}
                      </li>
                      <li>
                        • <strong>Proyecto Ejecutivo:</strong>{" "}
                        {t("dataRoom.noteExecutive").replace(
                          "Proyecto Ejecutivo: ",
                          "",
                        )}
                      </li>
                      <li>
                        • <strong>PGR:</strong>{" "}
                        {t("dataRoom.notePGR").replace("PGR: ", "")}
                      </li>
                      <li>
                        • <strong>ITE:</strong>{" "}
                        {t("dataRoom.noteITE").replace("ITE: ", "")}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataRoom;
