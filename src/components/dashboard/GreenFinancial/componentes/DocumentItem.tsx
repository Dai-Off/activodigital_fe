import React from "react";
import {
  CircleCheck,
  CircleAlert,
  TriangleAlert,
  FileText,
  Upload,
  Zap,
  Clock,
  Loader2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export type DocumentStatus = "pending" | "verified" | "rejected" | "queued" | "processing";

export interface DocumentData {
  label: string;
  value: string;
}

export interface DocumentMetadata {
  filename: string;
  size: string;
  date: string;
}

export interface DocumentProps {
  id: string;
  title: string;
  description: string;
  status: DocumentStatus;
  isObligatory?: boolean;
  metadata?: DocumentMetadata;
  extractedData?: DocumentData[];
  onUpload?: (file: File) => void;
}

const DocumentItem: React.FC<DocumentProps> = ({
  title,
  description,
  status,
  isObligatory,
  metadata,
  extractedData,
  onUpload,
}) => {
  const { t } = useTranslation();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onUpload) {
      onUpload(file);
    }
    // Reset para permitir subir el mismo archivo de nuevo
    if (event.target) {
      event.target.value = "";
    }
  };

  const getStatusStyles = () => {
    switch (status) {
      case "verified":
        return {
          container: "bg-green-100 text-green-700 border-green-200",
          icon: <CircleCheck className="w-5 h-5 text-green-600" />,
          statusLabel: t("dataRoom.verifiedStatus"),
        };
      case "rejected":
        return {
          container: "bg-red-100 text-red-700 border-red-200",
          icon: <CircleAlert className="w-5 h-5 text-red-600" />,
          statusLabel: t("dataRoom.rejectedStatus") || "Rechazado",
        };
      case "queued":
        return {
          container: "bg-amber-50 text-amber-700 border-amber-200",
          icon: <Clock className="w-5 h-5 text-amber-500" />,
          statusLabel: t("dataRoom.queuedStatus") || "En cola",
        };
      case "processing":
        return {
          container: "bg-blue-50 text-blue-700 border-blue-200",
          icon: <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />,
          statusLabel: t("dataRoom.processingStatus") || "Analizando...",
        };
      case "pending":
      default:
        return {
          container: "bg-gray-100 text-gray-700 border-gray-200",
          icon: <TriangleAlert className="w-5 h-5 text-gray-600" />,
          statusLabel: t("dataRoom.pendingStatus"),
        };
    }
  };

  const styles = getStatusStyles();

  // No mostrar botón de subir si ya está verificado, en cola o procesando
  const showUploadButton = status === "pending" || status === "rejected";

  return (
    <div className={`border-2 rounded-lg p-2 md:p-4 ${styles.container}`}>
      <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
        <div className="flex items-start gap-2 md:gap-4 flex-1 min-w-0">
          <div className="flex-shrink-0 mt-0.5">{styles.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start gap-1 md:gap-2 mb-1">
              <h4 className="text-xs md:text-sm text-gray-900 break-words pr-1">
                {title}
              </h4>
              {isObligatory && (
                <span className="px-1.5 md:px-2 py-0.5 bg-red-100 text-red-700 text-[10px] md:text-xs rounded whitespace-nowrap flex-shrink-0">
                  {t("dataRoom.obligatory")}
                </span>
              )}
            </div>
            <p className="text-[10px] md:text-xs text-gray-600 mb-1 md:mb-2 break-words">
              {description}
            </p>

            {showUploadButton && (
              <div className="flex items-center gap-2 mt-1 md:mt-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt"
                />
                <button
                  onClick={handleUploadClick}
                  className="px-2 md:px-3 py-1 md:py-1.5 bg-[#1e3a8a] text-white rounded text-[10px] md:text-xs hover:bg-blue-700 transition-colors flex items-center gap-1 whitespace-nowrap"
                >
                  <Upload className="w-2.5 h-2.5 md:w-3 md:h-3" />
                  <span className="hidden sm:inline">
                    {t("dataRoom.uploadDocument")}
                  </span>
                  <span className="sm:hidden">{t("dataRoom.upload")}</span>
                </button>
              </div>
            )}

            {/* Indicador visual para cola/procesamiento */}
            {status === "queued" && (
              <div className="flex items-center gap-2 mt-1 md:mt-2 text-[10px] md:text-xs text-amber-600">
                <Clock className="w-3 h-3" />
                <span>{t("dataRoom.queuedHint") || "Esperando turno de análisis..."}</span>
              </div>
            )}
            {status === "processing" && (
              <div className="flex items-center gap-2 mt-1 md:mt-2 text-[10px] md:text-xs text-blue-600">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>{t("dataRoom.processingHint") || "Analizando documento..."}</span>
              </div>
            )}

            {metadata && (
              <div className="flex flex-wrap items-center gap-1 md:gap-2 text-[10px] md:text-xs text-gray-600 mb-1">
                <FileText className="w-2.5 h-2.5 md:w-3 md:h-3 flex-shrink-0" />
                <span className="truncate">{metadata.filename}</span>
                <span className="hidden sm:inline">•</span>
                <span className="whitespace-nowrap">{metadata.size}</span>
                <span className="hidden sm:inline">•</span>
                <span className="whitespace-nowrap">{metadata.date}</span>
              </div>
            )}

            {extractedData && extractedData.length > 0 && (
              <div className="bg-white rounded p-1.5 md:p-2 mt-1 md:mt-2">
                <div className="text-[10px] md:text-xs text-gray-600 mb-0.5 md:mb-1">
                  {t("dataRoom.dataLabel")}
                </div>
                <ul className="space-y-0.5">
                  {extractedData.map((data, index) => (
                    <li
                      key={index}
                      className="text-[10px] md:text-xs text-gray-700 flex items-start gap-1"
                    >
                      <Zap className="w-2.5 h-2.5 md:w-3 md:h-3 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span className="break-words">
                        {data.label}: {data.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 self-start md:self-auto">
          <span
            className={`px-2 md:px-3 py-0.5 md:py-1 rounded-lg text-[10px] md:text-xs whitespace-nowrap ${styles.container}`}
          >
            {styles.statusLabel}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DocumentItem;
