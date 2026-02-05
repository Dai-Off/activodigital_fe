import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { BuildingsApiService, type Building } from "../services/buildingsApi";
import { SkeletonBase, SkeletonText } from "./ui/LoadingSystem";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Download, Trash2 } from "lucide-react";

type DocumentStatus = "available" | "missing" | "expiring";

interface DocumentItem {
  id: string;
  name: string;
  updated?: string;
  owner?: string;
  status: DocumentStatus;
  nextAction?: string;
}

interface DocumentSection {
  id: string;
  title: string;
  description: string;
  documents: DocumentItem[];
}

export default function BuildingDocuments() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [building, setBuilding] = useState<Building | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const loadBuilding = async () => {
      if (!id) return;
      try {
        const data = await BuildingsApiService.getBuildingById(id);
        setBuilding(data);
      } catch {
        setBuilding(null);
      } finally {
        setLoading(false);
      }
    };

    loadBuilding();
  }, [id]);

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(i18n.language === "es" ? "es-ES" : "en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }),
    [i18n.language]
  );

  const documentSections: DocumentSection[] = useMemo(
    () => [
      {
        id: "certificates",
        title: t("documentsCertificatesTitle"),
        description: t("documentsCertificatesDescription"),
        documents: [
          {
            id: "cee",
            name: t("documentsEnergyCertificate"),
            updated: "2024-02-10",
            owner: t("documentsOwnerTechnician"),
            status: "available",
          },
          {
            id: "ite",
            name: t("documentsITE"),
            updated: "2021-07-28",
            owner: t("documentsOwnerCityHall"),
            status: "expiring",
            nextAction: t("documentsITEAction"),
          },
        ],
      },
      {
        id: "plans",
        title: t("documentsPlansTitle"),
        description: t("documentsPlansDescription"),
        documents: [
          {
            id: "asbuilt",
            name: t("documentsAsBuilt"),
            updated: "2023-11-04",
            owner: t("documentsOwnerBim"),
            status: "available",
          },
          {
            id: "evac",
            name: t("documentsEvacuation"),
            status: "missing",
            nextAction: t("documentsUploadRequired"),
          },
        ],
      },
      {
        id: "legal",
        title: t("documentsLegalTitle"),
        description: t("documentsLegalDescription"),
        documents: [
          {
            id: "insurance",
            name: t("documentsInsurance"),
            updated: "2024-01-01",
            owner: t("documentsOwnerInsurance"),
            status: "available",
          },
          {
            id: "fire",
            name: t("documentsFireContract"),
            updated: "2022-09-14",
            status: "expiring",
            nextAction: t("documentsFireAction"),
          },
        ],
      },
    ],
    [t]
  );

  const totalDocuments = documentSections.reduce(
    (acc, section) => acc + section.documents.length,
    0
  );
  const missingDocuments = documentSections.reduce(
    (acc, section) =>
      acc + section.documents.filter((doc) => doc.status === "missing").length,
    0
  );
  const expiringDocuments = documentSections.reduce(
    (acc, section) =>
      acc + section.documents.filter((doc) => doc.status === "expiring").length,
    0
  );

  useEffect(() => {
    if (documentSections.length > 0) {
      setActiveSection(documentSections[0].id);
    }
  }, [documentSections]);

  if (!building && !loading) {
    return (
      <div className="p-6 sm:p-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
          <h2 className="text-lg font-semibold">
            {t("documentsNotFoundTitle")}
          </h2>
          <p className="mt-2 text-sm">
            {t("documentsNotFoundDescription")}
          </p>
          <div className="mt-4 flex justify-center">
            <Button variant="outline" onClick={() => navigate("/assets")}>
              {t("documentsBackToAssets")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {loading ? (
          <>
            <div className="flex-1">
              <SkeletonText lines={1} widths={["w-64"]} className="mb-2" />
              <SkeletonText lines={1} widths={["w-96"]} />
            </div>
            <SkeletonBase className="h-10 w-32 rounded-md" />
          </>
        ) : (
          <>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {t("documentsPageTitle")}{" "}
                · {building?.name}
              </h1>
              <p className="text-sm text-gray-600">
                {t("documentsPageSubtitle")}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                onClick={() => building && navigate(`/building/${id}/general-view`)}
              >
                {t("documentsBackToDetail")}
              </Button>
            </div>
          </>
        )}
      </div>

      <Card>
        <CardHeader>
          {loading ? (
            <>
              <SkeletonText lines={1} widths={["w-40"]} className="mb-2" />
              <SkeletonText lines={1} widths={["w-64"]} />
            </>
          ) : (
            <>
              <CardTitle className="text-lg text-gray-900">
                {t("documentsSummaryTitle")}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                {t("documentsSummaryDescription")}
              </CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-lg border border-gray-200 bg-white p-4"
                >
                  <SkeletonText lines={1} widths={["w-20"]} className="mb-2" />
                  <SkeletonText lines={1} widths={["w-16"]} className="mb-2" />
                  <SkeletonText lines={1} widths={["w-32"]} />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  {t("documentsSummaryFolders")}
                </p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {documentSections.length}
                </p>
                <p className="text-xs text-gray-500">
                  {t("documentsSummaryFoldersHint")}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  {t("documentsSummaryDocs")}
                </p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {totalDocuments}
                </p>
                <p className="text-xs text-gray-500">
                  {t("documentsSummaryDocsHint")}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  {t("documentsSummaryExpiring")}
                </p>
                <p className="mt-2 text-2xl font-semibold text-amber-600">
                  {expiringDocuments}
                </p>
                <p className="text-xs text-gray-500">
                  {t("documentsSummaryExpiringHint")}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  {t("documentsSummaryMissing")}
                </p>
                <p className="mt-2 text-2xl font-semibold text-red-600">
                  {missingDocuments}
                </p>
                <p className="text-xs text-gray-500">
                  {t("documentsSummaryMissingHint")}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        {loading ? (
          <>
            <div className="flex flex-wrap items-center gap-2">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonBase key={i} className="h-10 w-24 rounded-md" />
              ))}
            </div>
            <Card>
              <CardHeader>
                <SkeletonText lines={1} widths={["w-48"]} />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex-1">
                        <SkeletonText
                          lines={1}
                          widths={["w-32"]}
                          className="mb-2"
                        />
                        <SkeletonText lines={1} widths={["w-48"]} />
                      </div>
                      <SkeletonBase className="w-10 h-10 rounded-md" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2">
              {documentSections.map((section) => (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? "default" : "outline"}
                  onClick={() => setActiveSection(section.id)}
                >
                  {section.title}
                </Button>
              ))}
            </div>

            {documentSections
              .filter((section) => section.id === activeSection)
              .map((section) => (
                <Card key={section.id}>
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-lg text-gray-900">
                      {section.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      {section.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {section.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {doc.name}
                          </p>
                          {doc.owner && (
                            <p className="text-xs text-gray-500">{doc.owner}</p>
                          )}
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                            {doc.updated && (
                              <span>
                                {t("documentsUpdatedAt")}
                                : {dateFormatter.format(new Date(doc.updated))}
                              </span>
                            )}
                            {doc.nextAction && (
                              <span className="flex items-center gap-1 text-amber-600">
                                <svg
                                  className="h-3.5 w-3.5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11a.75.75 0 00-1.5 0v4.25c0 .414.336.75.75.75h2a.75.75 0 000-1.5h-1.25V7zM10 14a1 1 0 100 2 1 1 0 000-2z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                {doc.nextAction}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="size-9"
                            title={t("documentsDownload")}
                            disabled={doc.status === "missing"}
                          >
                            <Download className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="size-9 text-red-600 border-red-200 hover:bg-red-50"
                            title={t("documentsDelete")}
                            disabled={doc.status === "missing"}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
          </>
        )}
      </div>
    </div>
  );
}
