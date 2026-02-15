import React from "react";
import {
  CircleCheck,
  CircleAlert,
  Clock,
  TriangleAlert,
  FileText,
  Upload,
  Zap,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export type DocumentStatus = "pending" | "review" | "verified" | "rejected";

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
}

const DocumentItem: React.FC<DocumentProps> = ({
  title,
  description,
  status,
  isObligatory,
  metadata,
  extractedData,
}) => {
  const { t } = useTranslation();

  const getStatusStyles = () => {
    switch (status) {
      case "verified":
        return {
          container: "bg-green-100 text-green-700 border-green-200",
          icon: <CircleCheck className="w-5 h-5 text-green-600" />,
          statusLabel: t("dataRoom.verifiedStatus"),
        };
      case "review":
        return {
          container: "bg-orange-100 text-orange-700 border-orange-200",
          icon: <Clock className="w-5 h-5 text-orange-600" />,
          statusLabel: t("dataRoom.inReview"),
        };
      case "rejected":
        return {
          container: "bg-red-100 text-red-700 border-red-200",
          icon: <CircleAlert className="w-5 h-5 text-red-600" />,
          statusLabel: t("dataRoom.rejectedStatus") || "Rechazado",
        };
      default:
        return {
          container: "bg-gray-100 text-gray-700 border-gray-200",
          icon: <TriangleAlert className="w-5 h-5 text-gray-600" />,
          statusLabel: t("dataRoom.pendingStatus"),
        };
    }
  };

  const styles = getStatusStyles();

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

            {status === "pending" && (
              <div className="flex items-center gap-2 mt-1 md:mt-2">
                <button className="px-2 md:px-3 py-1 md:py-1.5 bg-[#1e3a8a] text-white rounded text-[10px] md:text-xs hover:bg-blue-700 transition-colors flex items-center gap-1 whitespace-nowrap">
                  <Upload className="w-2.5 h-2.5 md:w-3 md:h-3" />
                  <span className="hidden sm:inline">
                    {t("dataRoom.uploadDocument")}
                  </span>
                  <span className="sm:hidden">{t("dataRoom.upload")}</span>
                </button>
              </div>
            )}

            {status === "review" && (
              <div className="flex items-start gap-1 md:gap-2 text-[10px] md:text-xs text-orange-600 mt-1 md:mt-2">
                <Clock className="w-2.5 h-2.5 md:w-3 md:h-3 flex-shrink-0 mt-0.5" />
                <span className="break-words">{t("dataRoom.validating")}</span>
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
