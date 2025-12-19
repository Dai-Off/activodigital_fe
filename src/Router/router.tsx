import { Routes, Route, useNavigate } from "react-router-dom";
import NewLayout from "../components/NewLayout";
import Mantenimiento from "../components/Mantenimiento";
import Cumplimiento from "../components/Cumplimiento";
import BuildingUnits from "../components/BuildingUnits";
import BuildingDocuments from "../components/BuildingDocuments";
import { LibroDigital } from "../components/LibroDigital";
import Login from "../components/Login";
import Register from "../components/Register";
import RegisterWithInvitation from "../components/RegisterWithInvitation";
import AcceptAssignment from "../components/AcceptAssignment";
import InvitationHandler from "../components/InvitationHandler";
import Landing from "../components/Landing";
import CFOAssetsList from "../components/CFOAssetsList";
import BuildingDetail from "../components/BuildingDetail";
import BuildingAnalysisGeneral from "../components/BuildingAnalysisGeneral";
import CFOIntakeForm from "../components/cfo/CFOIntakeForm";
import CFOFinancialAnalysisDashboard from "../components/cfo/screens/CFOFinancialAnalysisDashboard";
import CFOFinancialAnalysisSimulation from "../components/cfo/screens/CFOFinancialAnalysisSimulation";
import ErrorBoundary from "../components/ErrorBoundary";
import ProtectedRoute from "../components/ProtectedRoute";

// Nuevos componentes para edificios y libro del edificio
import CreateBuildingWizard from "../components/buildings/CreateBuildingWizard";
import DigitalBookHub from "../components/digitalbook/DigitalBookHub";
import SectionEditor from "../components/digitalbook/SectionEditor";
import TermsAndConditions from "../components/TermsAndConditions";

// Página de lista de secciones (opcional)
import { AssetsDashboard } from "../components/dashboard/AssetsDashboard";

// Componentes Dashboard
import { MainPanel } from "../components/dashboard/Main/MainPanel";
import { Statistics } from "../components/dashboard/Main/Statistics";
import { RecentActivity } from "../components/dashboard/Main/RecentActivity";
import SectionsList from "~/components/digitalbook/SectionsList";
import { useTranslation } from "react-i18next";
import { AssetsMain } from "~/components/dashboard/Assets/AssetsMain";
import Users from "~/components/Users";
import { GreenFinancial } from "~/components/dashboard/GreenFinancial/GreenFinancial";
import { OpportunityRadar } from "~/components/dashboard/GreenFinancial/OpportunityRadar";
import FinancialTwin from "~/components/dashboard/GreenFinancial/FinancialTwin";
import { Assets } from "~/components/dashboard/Assets/Assets";
import { AssetsListDashboard } from "~/components/dashboard/Assets/AssetsListsDashboard";
import { BuildingGeneralView } from "~/components/BuildingGeneralView";
import { GeneralView } from "~/components/GeneralView";
import { BuildingCertificates } from "~/components/BuildingCertificates";
import { BuildingActivity } from "~/components/BuildingActivity";
import { BuildingFinancial } from "~/components/BuildingFinancial";
import { BuildingInsurance } from "~/components/BuildingInsurance";
import { BuildingRent } from "~/components/BuildingRent";
import { BuildingEnergyEfficiency } from "~/components/BuildingEnergyEfficiency";
import { BuildingMaintenance } from "~/components/BuildingMaintenance";
import { BuildingCalendar } from "~/components/BuildingCalendar";
import { Events } from "~/components/Events";

const SectionsListPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
        <div className="mb-8">
          <nav className="mb-4">
            <ol className="flex items-centered space-x-2 text-sm text-gray-500">
              <li>
                <button
                  onClick={() => navigate("/assets")}
                  className="hover:text-blue-600"
                >
                  {t("assets", "Activos")}
                </button>
              </li>
              <li>
                <svg
                  className="w-4 h-4 mx-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </li>
              <li>
                <button
                  onClick={() => navigate("/digital-book/hub/building-1")}
                  className="hover:text-blue-600"
                >
                  {t("digitalBook", "Libro del Edificio")}
                </button>
              </li>
              <li>
                <svg
                  className="w-4 h-4 mx-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </li>
              <li className="text-gray-900 font-medium">
                {t("sections", "Secciones")}
              </li>
            </ol>
          </nav>
        </div>
        <SectionsList />
      </div>
    </div>
  );
};

export const AppRouter = () => {
  /* Reglas para las rutas */

  /* La ruta debe estar en inglés y en minusculas ejem: /login, /building y así */

  /* Si la ruta require un espacio utilizar un guión (-) ejem: /digital-book */

  /* Evitar crear un componente en la ruta, o sea, solo se debe importar el componente y colocarlo y todo el código debe
  estar en su componente */

  /* Si se creó una ruta completamente nueva con subrutas o que pueda no quedar claro que hace, 
  se debe dejar un comentario explicativo para los compañeros */

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/auth/register" element={<RegisterWithInvitation />} />
      <Route path="/auth/invitation/:token" element={<InvitationHandler />} />
      <Route path="/auth/auto-accept" element={<AcceptAssignment />} />

      {/* Rutas públicas sin autenticación */}
      <Route path="/terms" element={<TermsAndConditions />} />

      {/* Landing page sin Layout (tiene su propio header y footer) */}
      <Route path="/" element={<Landing />} />

      {/* Rutas con nuevo diseño (NewLayout) */}
      <Route element={<NewLayout />}>
        {/* Si tienes varias opciones de navegación utiliza subrutas para ello de ejemplo la ruta /dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <AssetsDashboard />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        >
          <Route index element={<MainPanel />}></Route>
          <Route path="statistics" element={<Statistics />}></Route>
          <Route path="activity" element={<RecentActivity />}></Route>
        </Route>
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <Users />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <Events />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/assets"
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <Assets />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        >
          <Route index element={<AssetsMain />} />
          <Route path="list" element={<AssetsListDashboard />} />
        </Route>
        <Route
          path="/green-financial"
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <GreenFinancial />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        >
          <Route index element={<OpportunityRadar />} />
          <Route path="financial-twin" element={<FinancialTwin />}></Route>
        </Route>
        <Route
          path="/cfo-dashboard"
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <CFOAssetsList />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route
          path="/maintenance"
          element={
            <ProtectedRoute>
              <Mantenimiento />
            </ProtectedRoute>
          }
        />
        <Route
          path="/compliance"
          element={
            <ProtectedRoute>
              <Cumplimiento />
            </ProtectedRoute>
          }
        />

        {/* Subrutas Edificios */}

        <Route
          path="/building/:id/units"
          element={
            <ProtectedRoute>
              <BuildingUnits />
            </ProtectedRoute>
          }
        />
        <Route
          path="/building/:id/documents"
          element={
            <ProtectedRoute>
              <BuildingDocuments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/building/:id/general-view"
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <GeneralView />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        >
          <Route index element={<BuildingGeneralView />} />
          <Route path="financial" element={<BuildingFinancial />} />
          <Route path="insurance" element={<BuildingInsurance />} />
          <Route path="calendar" element={<BuildingCalendar />} />
          <Route path="rent" element={<BuildingRent />} />
          <Route
            path="energy-efficiency"
            element={<BuildingEnergyEfficiency />}
          />
          <Route path="maintenance" element={<BuildingMaintenance />} />
          <Route path="certificates" element={<BuildingCertificates />} />
          <Route path="activity" element={<BuildingActivity />} />
        </Route>

        <Route
          path="/digital-book"
          element={
            <ProtectedRoute>
              <LibroDigital />
            </ProtectedRoute>
          }
        />
        <Route
          path="/digital-book/hub/:buildingId"
          element={
            <ProtectedRoute>
              <DigitalBookHub />
            </ProtectedRoute>
          }
        />
        <Route
          path="/digital-book/section/:buildingId/:sectionId"
          element={
            <ProtectedRoute>
              <SectionEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/digital-book/sections"
          element={
            <ProtectedRoute>
              <SectionsListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/building/:id"
          element={
            <ProtectedRoute>
              <BuildingDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/building/:id/analysis-general"
          element={
            <ProtectedRoute>
              <BuildingAnalysisGeneral />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cfo-intake/:buildingId"
          element={
            <ProtectedRoute>
              <CFOIntakeForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cfo-due-diligence/:buildingId"
          element={
            <ProtectedRoute>
              <CFOFinancialAnalysisDashboard />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Rutas fullscreen protegidas (sin sidebar) */}
      <Route
        path="/cfo-simulation"
        element={
          <ProtectedRoute>
            <CFOFinancialAnalysisSimulation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/building/create"
        element={
          <ProtectedRoute>
            <CreateBuildingWizard />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Landing />} />
    </Routes>
  );
};
