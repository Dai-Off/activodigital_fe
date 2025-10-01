import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import ToastContainer from './components/ui/Toast'
import Layout from './components/Layout'
import Documentos from './components/Documentos'
import Mantenimiento from './components/Mantenimiento'
import Cumplimiento from './components/Cumplimiento'
import Unidades from './components/Unidades'
import { LibroDigital } from './components/LibroDigital'
import Login from './components/Login'
import Register from './components/Register'
import RegisterWithInvitation from './components/RegisterWithInvitation'
import AcceptAssignment from './components/AcceptAssignment'
import InvitationHandler from './components/InvitationHandler'
import Landing from './components/Landing'
import AssetsList from './components/AssetsList'
import BuildingDetail from './components/BuildingDetail'
import ErrorBoundary from './components/ErrorBoundary'
import ProtectedRoute from './components/ProtectedRoute'

// Nuevos componentes para edificios y libro digital
import CreateBuildingWizard from './components/buildings/CreateBuildingWizard'
import DigitalBookHub from './components/digitalbook/DigitalBookHub'
import PdfImportPage from './pages/PdfImportPage'
import SectionsList from './components/digitalbook/SectionsList'
import SectionEditor from './components/digitalbook/SectionEditor'

// Página de lista de secciones (opcional)
const SectionsListPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
        <div className="mb-8">
          <nav className="mb-4">
            <ol className="flex items-centered space-x-2 text-sm text-gray-500">
              <li>
                <button onClick={() => navigate('/activos')} className="hover:text-blue-600">Activos</button>
              </li>
              <li>
                <svg className="w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li>
                <button onClick={() => navigate('/libro-digital/hub/building-1')} className="hover:text-blue-600">
                  Libro Digital
                </button>
              </li>
              <li>
                <svg className="w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li className="text-gray-900 font-medium">Secciones</li>
            </ol>
          </nav>
        </div>
        <SectionsList />
      </div>
    </div>
  );
};

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/register" element={<RegisterWithInvitation />} />
            <Route path="/auth/invitation/:token" element={<InvitationHandler />} />
            <Route path="/auth/auto-accept" element={<AcceptAssignment />} />
            <Route path="/" element={<Landing />} />

            {/* Rutas protegidas (con navbar y contenedor) */}
            <Route element={<Layout />}>
              <Route
                path="/activos"
                element={
                  <ProtectedRoute>
                    <ErrorBoundary>
                      <AssetsList />
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/documentos"
                element={
                  <ProtectedRoute>
                    <Documentos />
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
                path="/unidades"
                element={
                  <ProtectedRoute>
                    <Unidades />
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
                path="/libro-digital/pdf-import"
                element={
                  <ProtectedRoute>
                    <PdfImportPage />
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
            </Route>

            {/* Rutas fullscreen protegidas */}
            <Route
              path="/edificios/crear"
              element={
                <ProtectedRoute requiredPermission="canCreateBuildings">
                  <CreateBuildingWizard />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Landing />} />
          </Routes>
          <ToastContainer />
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
