import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { RatingCircle, RatingStars } from './RatingCircle';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix para los iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  // SVGs para iconos
  const icons = {
    shieldCheck: (
      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.01 12.01 0 002.944 12c.047 1.47 1.076 2.767 2.784 3.737C7.882 17.567 9.8 18 12 18s4.118-.433 6.272-1.263c1.708-.97 2.737-2.267 2.784-3.737a12.01 12.01 0 00-.047-6.056z"/>
      </svg>
    ),
    clock: (
      <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
    wrench: (
      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.053 4.19a8.977 8.977 0 011.894 0M10 21v-2a4 4 0 014-4V5a4 4 0 014-4h2a2 2 0 012 2v16a2 2 0 01-2 2h-2a4 4 0 01-4-4v-2a4 4 0 01-4 4H4a2 2 0 01-2-2V3a2 2 0 012-2h2a4 4 0 014 4v12a4 4 0 014 4v2a2 2 0 01-2 2h-2z"/>
      </svg>
    ),
    alertCircle: (
      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
  };

  // Datos para el gráfico de dona
  const chartData = {
    labels: ["Completadas", "En progreso", "Programadas", "Vencidas"],
    datasets: [
      {
        data: [24, 8, 12, 3],
        backgroundColor: [
          "#10B981", // green-500
          "#3B82F6", // blue-500
          "#F59E0B", // yellow-500
          "#EF4444", // red-500
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12 },
        },
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Building Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4" style={{animation: 'fadeInUp 0.6s ease-out 0.1s both'}}>
        <div className="grid grid-cols-12 gap-4 items-start">
          <div className="col-span-12 lg:col-span-8">
            <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Hotel RIU PLAZA España</h2>
            <p className="text-gray-600 text-sm mt-0.5">Calle Gran Vía, 84, 28013 Madrid • Ref. Cat: 1234567890</p>

            {/* Meta compacta */}
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <div className="flex items-baseline gap-2">
                <span className="text-gray-500">Año construcción</span>
                <span className="font-medium text-gray-900">1953</span>
              </div>
              <div className="hidden sm:block h-4 w-px bg-gray-200" />
              <div className="flex items-baseline gap-2">
                <span className="text-gray-500">Superficie</span>
                <span className="font-medium text-gray-900">45,000 m²</span>
              </div>
              <div className="hidden sm:block h-4 w-px bg-gray-200" />
              <div className="flex items-baseline gap-2">
                <span className="text-gray-500">Habitaciones</span>
                <span className="font-medium text-gray-900">550 habitaciones</span>
              </div>
            </div>

            {/* KPIs compactos */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-lg border border-gray-200 p-3">
                <span className="block text-xs text-gray-500">Rating energético-ambiental</span>
                <div className="mt-1.5 flex items-center gap-2">
                  <RatingCircle rating="A" size="sm" />
                  <RatingStars stars={5} />
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 p-3">
                <span className="block text-xs text-gray-500">Huella de carbono</span>
                <p className="mt-1 font-medium text-gray-900">12.5 kg CO₂eq/m²·año</p>
              </div>
              <div className="rounded-lg border border-gray-200 p-3">
                <span className="block text-xs text-gray-500">Acceso a financiación</span>
                <span className="inline-flex mt-1 px-2 py-0.5 text-xs font-medium rounded-full border border-green-200 text-green-800 bg-green-50">Alta</span>
              </div>
            </div>

            {/* Bloques adicionales en la misma card */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Cumplimiento por tipología */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Cumplimiento por tipología</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Terciario</span>
                        <span className="font-medium text-gray-900">81%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-blue-500 rounded-full" style={{ width: '81%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Libro del Edificio Digital (estado) */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Libro del Edificio Digital</h4>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">Publicado</span>
                    <span className="text-xs text-gray-500">Versión 1.2 • Actualizado Sep 2025</span>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Completado</span>
                      <span className="font-medium text-gray-900">6/8</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-green-500 rounded-l-full" style={{ width: '75%' }} />
                    </div>
                  </div>
                </div>

                {/* Progreso de secciones + Estado por sección */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Estado por sección</h4>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="p-2 rounded-md border border-green-200 bg-green-50 text-green-800 text-center">OK</div>
                    <div className="p-2 rounded-md border border-yellow-200 bg-yellow-50 text-yellow-800 text-center">Pendiente</div>
                    <div className="p-2 rounded-md border border-red-200 bg-red-50 text-red-800 text-center">Vence</div>
                  </div>
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-gray-600">
                      <span>Instalaciones</span><span className="font-medium text-green-700">OK</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-600">
                      <span>Certificados</span><span className="font-medium text-yellow-700">Pendiente</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-600">
                      <span>Mantenimiento</span><span className="font-medium text-green-700">OK</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-600">
                      <span>Inspecciones</span><span className="font-medium text-red-700">Vence</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:self-stretch">
            <img 
              src="/image.png" 
              alt="Hotel RIU PLAZA España" 
              className="w-full h-full object-cover rounded-lg" 
            />
          </div>
        </div>
      </div>

      {/* Libro Digital Button */}
      <div className="mb-4" style={{animation: 'fadeInUp 0.6s ease-out 0.15s both'}}>
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">Libro Digital del Edificio</h3>
              <p className="text-blue-100 mb-4">Accede a toda la documentación técnica, certificados y normativas del edificio</p>
              <div className="flex items-center gap-2 text-sm text-blue-100">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>77% completado • Versión 1.2.0 • Actualizado 2025-09-01</span>
              </div>
            </div>
            <div className="ml-6">
              <Link 
                to="/libro-digital" 
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-transform"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
                Abrir Libro Digital
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid mt-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6" style={{animation: 'fadeInUp 0.6s ease-out 0.2s both'}}>
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">{icons.shieldCheck}</div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Cumplimiento Legal</h3>
              <p className="text-2xl font-semibold text-gray-900">95%</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6" style={{animation: 'fadeInUp 0.6s ease-out 0.3s both'}}>
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">{icons.clock}</div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Próximas Caducidades</h3>
              <p className="text-2xl font-semibold text-gray-900">3</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6" style={{animation: 'fadeInUp 0.6s ease-out 0.4s both'}}>
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">{icons.wrench}</div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Tareas Mantenimiento</h3>
              <p className="text-2xl font-semibold text-gray-900">12</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6" style={{animation: 'fadeInUp 0.6s ease-out 0.5s both'}}>
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">{icons.alertCircle}</div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Incidencias Abiertas</h3>
              <p className="text-2xl font-semibold text-gray-900">2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Maintenance Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6" style={{animation: 'fadeInUp 0.6s ease-out 0.6s both'}}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan de Mantenimiento</h3>
          <div className="relative h-48">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl border border-gray-200 p-6" style={{animation: 'fadeInUp 0.6s ease-out 0.7s both'}}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">Certificado CEE renovado</p>
                <p className="text-xs text-gray-500">Hace 2 días</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">Mantenimiento HVAC completado</p>
                <p className="text-xs text-gray-500">Hace 1 semana</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">Inspección de ascensor programada</p>
                <p className="text-xs text-gray-500">En 3 días</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">Incidencia en sistema PCI</p>
                <p className="text-xs text-gray-500">Hace 5 días</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location and Valuation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Map */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6" style={{animation: 'fadeInUp 0.6s ease-out 0.75s both'}}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ubicación del Edificio</h3>
          <div className="h-64 rounded-lg overflow-hidden border border-gray-200">
            <MapContainer
              center={[40.424167, -3.711944]} // Coordenadas del Hotel RIU PLAZA España, Madrid
              zoom={15}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[40.424167, -3.711944]}>
                <Popup>
                  <div className="text-center">
                    <strong>Hotel RIU PLAZA España</strong><br/>
                    Calle Gran Vía, 84, 28013 Madrid<br/>
                    España<br/>
                    <div className="mt-2 text-sm text-gray-600">
                      <div>📞 +34 919 193 393</div>
                      <div>✉️ reservas@riu.com</div>
                      <div>🌐 www.riu.com</div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Municipio:</span>
              <p className="font-medium text-gray-900">Madrid</p>
            </div>
            <div>
              <span className="text-gray-500">Provincia:</span>
              <p className="font-medium text-gray-900">Madrid</p>
            </div>
            <div>
              <span className="text-gray-500">Coordenadas:</span>
              <p className="font-mono text-xs text-gray-700">40.424167, -3.711944</p>
            </div>
            <div>
              <span className="text-gray-500">Código postal:</span>
              <p className="font-medium text-gray-900">28013</p>
            </div>
          </div>
        </div>

        {/* Property Valuation */}
        <div className="bg-white rounded-xl border border-gray-200 p-6" style={{animation: 'fadeInUp 0.6s ease-out 0.8s both'}}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Valoración del Inmueble</h3>
          <div className="space-y-6">
            {/* Valor Total */}
            <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <p className="text-sm text-gray-600 mb-1">Valor Total Estimado</p>
              <p className="text-3xl font-bold text-green-600">€4,890,000</p>
              <p className="text-xs text-gray-500 mt-1">Actualizado: Sep 2025</p>
            </div>

            {/* Desglose */}
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Valor por m²:</span>
                <span className="font-medium text-gray-900">€1,996/m²</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Valor por vivienda:</span>
                <span className="font-medium text-gray-900">€203,750</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Variación anual:</span>
                <span className="font-medium text-green-600">+5.2%</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Última tasación:</span>
                <span className="font-medium text-gray-900">Jun 2025</span>
              </div>
            </div>

            {/* Estado del mercado */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
                <span className="text-sm font-medium text-blue-900">Mercado Local</span>
              </div>
              <p className="text-xs text-blue-700">Tendencia alcista en zona residencial de Zierbena</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="mt-6">
        <div className="bg-white rounded-xl border border-gray-200" style={{animation: 'fadeInUp 0.6s ease-out 0.8s both'}}>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Alertas y Próximos Vencimientos</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  <div>
                    <p className="font-medium text-red-900">Revisión ascensor vence en 15 días</p>
                    <p className="text-sm text-red-700">Industria • Ascensor Principal</p>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">Programar</button>
              </div>
              <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <div>
                    <p className="font-medium text-yellow-900">Mantenimiento RITE trimestral</p>
                    <p className="text-sm text-yellow-700">Sistema HVAC • Zona común</p>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors">Ver detalles</button>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2z"/>
                  </svg>
                  <div>
                    <p className="font-medium text-blue-900">Actualización manual de uso</p>
                    <p className="text-sm text-blue-700">Documentación • Sistema eléctrico</p>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">Revisar</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animaciones */}
      <style>
        {`
          @keyframes fadeInUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}
