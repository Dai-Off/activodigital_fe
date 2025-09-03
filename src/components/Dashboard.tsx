import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { fetchMe } from '../services/auth';

// Fix para los iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [me, setMe] = useState<{ full_name: string; role: string } | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const resp = await fetchMe();
        if (mounted) setMe({ full_name: resp.full_name, role: resp.role });
      } catch {
        // Silencioso: si falla, no bloquea el dashboard
      }
    })();
    return () => { mounted = false };
  }, []);
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
      {me && (
        <div className="mt-0 mb-4 animate-fadeInUp">
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-600/10 text-blue-700 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="7" r="4" />
                  <path d="M5.5 20a6.5 6.5 0 0113 0" />
                </svg>
              </div>
              <div>
                <div className="text-sm text-gray-500">Bienvenido</div>
                <div className="text-base font-semibold text-gray-900 leading-tight">{me.full_name}</div>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-sm border border-gray-200 text-gray-700 capitalize bg-gray-50">{me.role}</span>
          </div>
        </div>
      )}
      {/* Building Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6" style={{animation: 'fadeInUp 0.6s ease-out 0.1s both'}}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-gray-900 tracking-tight mb-2">Edificio Residencial Kardeo</h2>
            <p className="text-gray-600 mb-4">Barrio de Kardeo 14, Zierbena • Ref. Cat: 1234567890</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-sm text-gray-500">Año construcción</span>
                <p className="font-medium">2019</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Superficie</span>
                <p className="font-medium">2,450 m²</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Unidades</span>
                <p className="font-medium">24 viviendas</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Estado</span>
                <p className="font-medium text-green-600">Excelente</p>
              </div>
            </div>
          </div>
          <div className="mt-6 lg:mt-0 lg:ml-6">
            <img 
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&h=200&fit=crop&crop=building" 
              alt="Building" 
              className="w-full lg:w-48 h-32 object-cover rounded-lg" 
            />
          </div>
        </div>
      </div>

      {/* Libro Digital Button */}
      <div className="mb-6" style={{animation: 'fadeInUp 0.6s ease-out 0.15s both'}}>
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
      <div className="grid mt-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
              center={[43.3255, -3.0123]} // Coordenadas de Zierbena, País Vasco
              zoom={15}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[43.3255, -3.0123]}>
                <Popup>
                  <div className="text-center">
                    <strong>Edificio Residencial Kardeo</strong><br/>
                    Barrio de Kardeo 14, Zierbena<br/>
                    Vizcaya, País Vasco, España
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Municipio:</span>
              <p className="font-medium text-gray-900">Zierbena</p>
            </div>
            <div>
              <span className="text-gray-500">Provincia:</span>
              <p className="font-medium text-gray-900">Vizcaya</p>
            </div>
            <div>
              <span className="text-gray-500">Coordenadas:</span>
              <p className="font-mono text-xs text-gray-700">43.3255, -3.0123</p>
            </div>
            <div>
              <span className="text-gray-500">Código postal:</span>
              <p className="font-medium text-gray-900">48508</p>
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
