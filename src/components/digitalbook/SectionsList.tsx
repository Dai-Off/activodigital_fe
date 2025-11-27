import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface Section {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: "pending" | "completed" | "in-progress";
}

interface SectionsListProps {
  buildingId?: string;
  buildingName?: string;
  sections?: Section[];
  onSectionClick?: (sectionId: string) => void;
  onMarkComplete?: (sectionId: string) => void;
}

const DEFAULT_SECTIONS: Section[] = [
  {
    id: "general_data",
    title: "sections.general_data.title",
    description: "sections.general_data.description",
    icon: "🏢",
    status: "pending",
  },
  {
    id: "construction_features",
    title: "sections.construction_features.title",
    description: "sections.construction_features.description",
    icon: "🔧",
    status: "pending",
  },
  {
    id: "certificates",
    title: "sections.certificates.title",
    description: "sections.certificates.description",
    icon: "📜",
    status: "pending",
  },
  {
    id: "maintenance",
    title: "sections.maintenance.title",
    description: "sections.maintenance.description",
    icon: "🔨",
    status: "pending",
  },
  {
    id: "installations",
    title: "sections.installations.title",
    description: "sections.installations.description",
    icon: "⚡",
    status: "pending",
  },
  {
    id: "reforms",
    title: "sections.reforms.title",
    description: "sections.reforms.description",
    icon: "🏗️",
    status: "pending",
  },
  {
    id: "sustainability",
    title: "sections.sustainability.title",
    description: "sections.sustainability.description",
    icon: "🌱",
    status: "pending",
  },
  {
    id: "attachments",
    title: "sections.attachments.title",
    description: "sections.attachments.description",
    icon: "📎",
    status: "pending",
  },
];

const SectionsList: React.FC<SectionsListProps> = ({
  buildingId = "building-1",
  buildingName = "Torre Central",
  sections = DEFAULT_SECTIONS,
  onSectionClick,
  onMarkComplete,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSectionClick = (sectionId: string) => {
    if (onSectionClick) {
      onSectionClick(sectionId);
    } else {
      // Navegar al wizard directamente a esa sección
      navigate("/digital-book/manual", {
        state: {
          buildingId,
          buildingName,
          startSection: sectionId,
        },
      });
    }
  };

  const handleMarkComplete = (e: React.MouseEvent, sectionId: string) => {
    e.stopPropagation(); // Evitar que se active el click de la sección
    if (onMarkComplete) {
      onMarkComplete(sectionId);
    } else {
      // Simular marcado como completo
      console.log(`Marcar sección ${sectionId} como completada`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-600 font-medium">
              {t("status.completed", "Completada")}
            </span>
          </div>
        );
      case "in-progress":
        return (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-yellow-600 font-medium">
              {t("status.inProgress", "En progreso")}
            </span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span className="text-sm text-gray-500 font-medium">
              {t("status.pending", "Pendiente")}
            </span>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {t("sectionsList.title", "Secciones del Libro del Edificio")}
        </h2>
        <p className="text-gray-600">
          {t(
            "sectionsList.instructions",
            "Revisa y completa cada sección. Haz clic en cualquier sección para editarla directamente."
          )}
        </p>
      </div>

      {/* Lista de secciones */}
      <div className="divide-y divide-gray-200">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className="p-6 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
            onClick={() => handleSectionClick(section.id)}
          >
            <div className="flex items-center justify-between">
              {/* Contenido de la sección */}
              <div className="flex items-center space-x-4 flex-1">
                {/* Número */}
                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                  {index + 1}
                </div>

                {/* Icono removido */}

                {/* Información */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {t(section.title)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t(section.description)}
                  </p>
                </div>
              </div>

              {/* Estado y acciones */}
              <div className="flex items-center space-x-4 flex-shrink-0">
                {/* Badge de estado */}
                {getStatusBadge(section.status)}

                {/* Botón Marcar completa */}
                <button
                  onClick={(e) => handleMarkComplete(e, section.id)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  {t("sectionsList.markComplete", "Marcar completa")}
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer con acciones */}
      <div className="p-6 bg-gray-50 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
          {/* Progreso */}
          <div className="text-sm text-gray-600">
            {t("sectionsList.progress", {
              completed: sections.filter((s) => s.status === "completed")
                .length,
              total: sections.length,
              defaultValue: "{{completed}} de {{total}} secciones completadas",
            })}
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/digital-book/manual")}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {t("sectionsList.continueWizard", "Continuar con Wizard")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionsList;
