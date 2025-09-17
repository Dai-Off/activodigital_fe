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
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Landing />} />

        {/* Rutas protegidas bajo Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/activos" element={<AssetsList />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/documentos" element={<Documentos />} />
            <Route path="/mantenimiento" element={<Mantenimiento />} />
            <Route path="/cumplimiento" element={<Cumplimiento />} />
            <Route path="/unidades" element={<Unidades />} />
            <Route path="/libro-digital" element={<LibroDigital />} />
          </Route>
        </Route>

        {/* Fallback: cualquier otra ruta al landing o 404 futura */}
        <Route path="*" element={<Landing />} />
      </Routes>
    </Router>
  )
}

export default App
