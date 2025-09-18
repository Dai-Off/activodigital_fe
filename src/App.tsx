import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import Documentos from './components/Documentos'
import Mantenimiento from './components/Mantenimiento'
import Cumplimiento from './components/Cumplimiento'
import Unidades from './components/Unidades'
import { LibroDigital } from './components/LibroDigital'
import Login from './components/Login'
import Register from './components/Register'
import Landing from './components/Landing'
import AssetsList from './components/AssetsList'
// import ProtectedRoute from './components/ProtectedRoute'

// Nuevos componentes para edificios y libro digital
import CreateBuildingWizard from './components/buildings/CreateBuildingWizard'
import DigitalBookHub from './components/digitalbook/DigitalBookHub'
import ManualBookPage from './pages/ManualBookPage'
import PdfImportPage from './pages/PdfImportPage'
import SectionsList from './components/digitalbook/SectionsList'
import SectionEditor from './components/digitalbook/SectionEditor'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Landing />} />

        {/* Rutas sin protección temporalmente */}
        <Route element={<Layout />}>
          <Route path="/activos" element={<AssetsList />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/documentos" element={<Documentos />} />
          <Route path="/mantenimiento" element={<Mantenimiento />} />
          <Route path="/cumplimiento" element={<Cumplimiento />} />
          <Route path="/unidades" element={<Unidades />} />
          <Route path="/libro-digital" element={<LibroDigital />} />
        </Route>

        {/* Rutas fullscreen sin protección temporalmente */}
        <Route path="/edificios/crear" element={<CreateBuildingWizard />} />
        <Route path="/libro-digital/hub" element={<DigitalBookHub />} />
        <Route path="/libro-digital/manual" element={<ManualBookPage />} />
        <Route path="/libro-digital/pdf-import" element={<PdfImportPage />} />
        <Route path="/libro-digital/section/:sectionId" element={<SectionEditor />} />
        <Route path="/libro-digital/sections" element={
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <nav className="mb-4">
                  <ol className="flex items-center space-x-2 text-sm text-gray-500">
                    <li>
                      <button 
                        onClick={() => window.location.href = '/activos'}
                        className="hover:text-blue-600"
                      >
                        Activos
                      </button>
                    </li>
                    <li>
                      <svg className="w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </li>
                    <li>
                      <button 
                        onClick={() => window.location.href = '/libro-digital/hub'}
                        className="hover:text-blue-600"
                      >
                        Libro Digital
                      </button>
                    </li>
                    <li>
                      <svg className="w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </li>
                    <li className="text-gray-900 font-medium">
                      Secciones
                    </li>
                  </ol>
                </nav>
              </div>
              <SectionsList />
            </div>
          </div>
        } />

        {/* Fallback: cualquier otra ruta al landing o 404 futura */}
        <Route path="*" element={<Landing />} />
      </Routes>
    </Router>
  )
}

export default App