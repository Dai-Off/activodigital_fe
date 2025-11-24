import { BrowserRouter as Router } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import ToastContainer from "./components/ui/Toast";

// Página de lista de secciones (opcional)
import { useTranslation } from "react-i18next";
<<<<<<< HEAD
import { AppRouter } from "./Router/router";
=======
import { AssetsDashboard } from "./components/dashboard/AssetsDashboard";
import { MainPanel } from "./components/dashboard/Main/MainPanel";
import { Statistics } from "./components/dashboard/Main/Statistics";
import { RecentActivity } from "./components/dashboard/Main/RecentActivity";
import { AssetsMain } from "./components/dashboard/Assets/AssetsMain";

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
                  onClick={() => navigate("/activos")}
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
                  onClick={() => navigate("/libro-digital/hub/building-1")}
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
>>>>>>> feature/dashboard-inicio

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = (i18n.language || "es").split("-")[0];
  }, [i18n.language]);

  return (
    <ToastProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
<<<<<<< HEAD
            <AppRouter />
=======
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/auth/register"
                element={<RegisterWithInvitation />}
              />
              <Route
                path="/auth/invitation/:token"
                element={<InvitationHandler />}
              />
              <Route path="/auth/auto-accept" element={<AcceptAssignment />} />

              {/* Rutas públicas sin autenticación */}
              <Route path="/terminos" element={<TermsAndConditions />} />

              {/* Landing page sin Layout (tiene su propio header y footer) */}
              <Route path="/" element={<Landing />} />

              {/* Rutas con nuevo diseño (NewLayout) */}
              <Route element={<NewLayout />}>
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
                  <Route path="estadisticas" element={<Statistics />}></Route>
                  <Route path="actividad" element={<RecentActivity />}></Route>
                </Route>
                <Route
                  path="/activos"
                  element={
                    <ProtectedRoute>
                      <ErrorBoundary>
                        <AssetsMain />
                      </ErrorBoundary>
                    </ProtectedRoute>
                  }
                ></Route>
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
                  path="/mantenimiento"
                  element={
                    <ProtectedRoute>
                      <Mantenimiento />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cumplimiento"
                  element={
                    <ProtectedRoute>
                      <Cumplimiento />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/edificio/:id/unidades"
                  element={
                    <ProtectedRoute>
                      <BuildingUnits />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/edificio/:id/documentacion"
                  element={
                    <ProtectedRoute>
                      <BuildingDocuments />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/libro-digital"
                  element={
                    <ProtectedRoute>
                      <LibroDigital />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/libro-digital/hub/:buildingId"
                  element={
                    <ProtectedRoute>
                      <DigitalBookHub />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/libro-digital/section/:buildingId/:sectionId"
                  element={
                    <ProtectedRoute>
                      <SectionEditor />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/libro-digital/sections"
                  element={
                    <ProtectedRoute>
                      <SectionsListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/edificio/:id"
                  element={
                    <ProtectedRoute>
                      <BuildingDetail />
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
                path="/edificios/crear"
                element={
                  <ProtectedRoute>
                    <CreateBuildingWizard />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Landing />} />
            </Routes>
>>>>>>> feature/dashboard-inicio
            <ToastContainer />
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
