import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import Documentos from './components/Documentos'
import Mantenimiento from './components/Mantenimiento'
import Cumplimiento from './components/Cumplimiento'
import Unidades from './components/Unidades'
import { LibroDigital } from './components/LibroDigital'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/documentos" element={<Documentos />} />
          <Route path="/mantenimiento" element={<Mantenimiento />} />
          <Route path="/cumplimiento" element={<Cumplimiento />} />
          <Route path="/unidades" element={<Unidades />} />
          <Route path="/libro-digital" element={<LibroDigital />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
