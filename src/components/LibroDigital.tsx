// Mock data del libro digital
const libroData = {
  "libroId": "6a8f3c7e-0a19-4d92-9b7f-1a52a5a3b0f9",
  "edificioId": "b6e3c1f2-1a6a-4e0a-9a0a-12f4c9a4e1aa",
  "version": "1.2.0",
  "estado": "aprobado",
  "fechaCreacion": "2025-07-10",
  "fechaUltimaActualizacion": "2025-09-01",
  "responsable": { "usuarioId": "e1a2b3c4-d5e6-7890-abcd-ef1234567890", "nombre": "María López" },
  "normativaReferencia": [
    { "ambito": "nacional", "norma": "CTE", "version": "2024" },
    { "ambito": "UE", "norma": "EPBD", "version": "2024" },
    { "ambito": "local", "norma": "Ordenanza ITE Madrid", "version": "2023" }
  ],
  "progreso": {
    "totalSecciones": 9,
    "seccionesCompletas": 7,
    "porcentaje": 77
  },
  "snapshot": {
    "certificadosIds": [
      "2f0d0a7b-7a9c-4b71-8c3a-54d6f7e9a100"
    ],
    "intervencionesIds": [
      "b1c22344-5566-4e77-9a88-0d11aa22bb33",
      "c2d33455-6677-4f88-9b99-1e22bb33cc44"
    ],
    "instalacionesIds": [
      "8aa6a2fe-93e7-4b8d-b1b3-97f2a6c0f111",
      "9bb7b3ef-a4f8-4c9e-c2c4-a8f3b7d0e222"
    ],
    "documentosIds": ["doc-001", "doc-002", "doc-003", "doc-010", "doc-020", "doc-040"]
  },
  "firmas": [
    {
      "firmaId": "sig-001",
      "seccion": "proyecto_y_documentacion_tecnica",
      "usuarioId": "0a1b2c3d-4e5f-6789-abcd-0123456789ab",
      "rol": "tecnico",
      "fecha": "2025-08-30T14:20:00Z",
      "hash": "SHA256:abf9…"
    },
    {
      "firmaId": "sig-002",
      "seccion": "versionado_y_firmas",
      "usuarioId": "e1a2b3c4-d5e6-7890-abcd-ef1234567890",
      "rol": "responsable",
      "fecha": "2025-09-01T11:05:00Z",
      "hash": "SHA256:cd99…"
    }
  ],
  "documentosAdjuntos": [
    { "documentoId": "doc-001", "tipo": "proyecto_ejecucion", "formato": "PDF", "firmado": true },
    { "documentoId": "doc-002", "tipo": "certificado_final_obra", "formato": "PDF", "firmado": true },
    { "documentoId": "doc-040", "tipo": "CEE", "formato": "PDF", "firmado": true }
  ],
  "routes": {
    "volverAlEdificio": "/tenedor/edificios/b6e3c1f2-1a6a-4e0a-9a0a-12f4c9a4e1aa",
    "descargarPdf": "/api/mock/lde/6a8f3c7e/pdf"
  },
  "secciones": [
    {
      "nombre": "proyecto_y_documentacion_tecnica",
      "titulo": "Proyecto y Documentación Técnica",
      "estado": "completo",
      "checklist": [
        { "item": "Proyecto de ejecución visado", "ok": true, "evidenciaDocId": "doc-001" },
        { "item": "Certificado final de obra", "ok": true, "evidenciaDocId": "doc-002" },
        { "item": "Licencias y autorizaciones", "ok": true, "evidenciaDocId": "doc-003" }
      ],
      "observaciones": ""
    },
    {
      "nombre": "manual_uso_y_mantenimiento",
      "titulo": "Manual de Uso y Mantenimiento",
      "estado": "completo",
      "checklist": [
        { "item": "Manual de uso general", "ok": true, "evidenciaDocId": "doc-010" },
        { "item": "Recomendaciones de conservación", "ok": true, "evidenciaDocId": "doc-011" }
      ]
    },
    {
      "nombre": "plan_mantenimiento",
      "titulo": "Plan de Mantenimiento",
      "estado": "parcial",
      "checklist": [
        { "item": "Plan preventivo anual", "ok": true, "evidenciaDocId": "doc-020" },
        { "item": "Calendario y responsables", "ok": false, "evidenciaDocId": null }
      ],
      "observaciones": "Falta adjuntar calendario firmado."
    },
    {
      "nombre": "instalaciones",
      "titulo": "Instalaciones",
      "estado": "completo",
      "checklist": [
        { "item": "Inventario de instalaciones", "ok": true, "evidenciaDocId": "doc-030" }
      ]
    },
    {
      "nombre": "certificados_y_garantias",
      "titulo": "Certificados y Garantías",
      "estado": "completo",
      "checklist": [
        { "item": "CEE vigente", "ok": true, "evidenciaDocId": "doc-040" },
        { "item": "Seguro decenal (si aplica)", "ok": true, "evidenciaDocId": "doc-041" }
      ]
    },
    {
      "nombre": "intervenciones_incidencias",
      "titulo": "Intervenciones e Incidencias",
      "estado": "completo",
      "checklist": [
        { "item": "Registro de intervenciones últimos 10 años", "ok": true, "evidenciaDocId": "doc-050" }
      ]
    },
    {
      "nombre": "agentes_intervinientes",
      "titulo": "Agentes Intervinientes",
      "estado": "completo",
      "checklist": [
        { "item": "Promotor/Constructor/Dirección Facultativa", "ok": true, "evidenciaDocId": "doc-060" }
      ]
    },
    {
      "nombre": "versionado_y_firmas",
      "titulo": "Versionado y Firmas",
      "estado": "completo",
      "checklist": [
        { "item": "Historial de versiones", "ok": true },
        { "item": "Firmas por sección", "ok": true }
      ]
    },
    {
      "nombre": "publicacion_y_accesos",
      "titulo": "Publicación y Accesos",
      "estado": "parcial",
      "checklist": [
        { "item": "URL pública activa", "ok": true },
        { "item": "QR visible", "ok": false }
      ],
      "observaciones": "Generar QR final tras publicación definitiva."
    }
  ],
  "publicacion": {
    "estadoPublicacion": "publicado",
    "qr": { "codigo": "QR-LDE-1.2.0", "urlImagen": "/mock/qr/lde-1.2.0.png" },
    "urlPublica": "https://ad.example/lde/6a8f3c7e",
    "nivelAcceso": "publico",
    "vigenteDesde": "2025-09-01",
    "vigenteHasta": null
  },
  "alertas": [
    { "tipo": "pendiente_qr", "criticidad": "baja", "mensaje": "Generar QR final al publicar." }
  ]
};

export function LibroDigital() {
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "completo": return "bg-green-100 text-green-800 border-green-200";
      case "parcial": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "pendiente": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "completo": return "✓";
      case "parcial": return "⚠";
      case "pendiente": return "⚪";
      default: return "?";
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Libro Digital del Edificio</h1>
            <p className="text-gray-600">Edificio Residencial Kardeo</p>
            <div className="flex items-center gap-4 mt-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {libroData.estado}
              </span>
              <span className="text-sm text-gray-500">Versión {libroData.version}</span>
              <span className="text-sm text-gray-500">Actualizado: {libroData.fechaUltimaActualizacion}</span>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">ID del Libro:</span>
                  <p className="font-mono text-xs text-gray-700 bg-gray-50 p-1 rounded mt-1">{libroData.libroId}</p>
                </div>
                <div>
                  <span className="text-gray-500">ID del Edificio:</span>
                  <p className="font-mono text-xs text-gray-700 bg-gray-50 p-1 rounded mt-1">{libroData.edificioId}</p>
                </div>
                <div>
                  <span className="text-gray-500">Fecha de creación:</span>
                  <p className="text-gray-700">{libroData.fechaCreacion}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
              <span className="text-gray-400 text-xs">QR Code</span>
            </div>
            <p className="text-xs text-gray-500">{libroData.publicacion.qr.codigo}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
            style={{ width: `${libroData.progreso.porcentaje}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>{libroData.progreso.seccionesCompletas} de {libroData.progreso.totalSecciones} secciones completas</span>
          <span>{libroData.progreso.porcentaje}% completado</span>
        </div>
      </div>

      {/* Responsable y Normativa */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Responsable</h3>
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium text-sm">
                  {libroData.responsable.nombre.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{libroData.responsable.nombre}</p>
                <p className="text-sm text-gray-500">Responsable técnico</p>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-500">Usuario ID:</span>
              <p className="font-mono text-xs text-gray-600 bg-gray-50 p-1 rounded mt-1">{libroData.responsable.usuarioId}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Normativa de Referencia</h3>
          <div className="space-y-2">
            {libroData.normativaReferencia.map((norma, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <span className="text-sm font-medium text-gray-700">{norma.norma}</span>
                <div className="flex gap-2">
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">{norma.ambito}</span>
                  <span className="text-xs px-2 py-1 bg-blue-100 rounded text-blue-600">{norma.version}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secciones */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Secciones del Libro</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {libroData.secciones.map((seccion, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900 text-sm">{seccion.titulo}</h4>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getEstadoColor(seccion.estado)}`}>
                  {getEstadoIcon(seccion.estado)} {seccion.estado}
                </span>
              </div>
              
              <div className="space-y-2 mb-3">
                {seccion.checklist.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center gap-2 text-sm">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                      item.ok ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {item.ok ? '✓' : '✗'}
                    </span>
                    <span className={item.ok ? 'text-gray-700' : 'text-red-600'}>{item.item}</span>
                  </div>
                ))}
              </div>
              
              {seccion.observaciones && (
                <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                  {seccion.observaciones}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Publicación y Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Publicación</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Estado:</span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {libroData.publicacion.estadoPublicacion}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Nivel de acceso:</span>
              <span className="text-sm font-medium text-gray-900">{libroData.publicacion.nivelAcceso}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Vigente desde:</span>
              <span className="text-sm font-medium text-gray-900">{libroData.publicacion.vigenteDesde}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Vigente hasta:</span>
              <span className="text-sm font-medium text-gray-900">
                {libroData.publicacion.vigenteHasta || 'Sin fecha límite'}
              </span>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="space-y-2">
                <a 
                  href={libroData.publicacion.urlPublica} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium underline block"
                >
                  Ver versión pública →
                </a>
                <div className="text-xs text-gray-500">
                  QR URL: {libroData.publicacion.qr.urlImagen}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas Activas</h3>
          {libroData.alertas.length > 0 ? (
            <div className="space-y-3">
              {libroData.alertas.map((alerta, index) => (
                <div key={index} className={`p-3 rounded-lg border ${
                  alerta.criticidad === 'alta' ? 'bg-red-50 border-red-200' :
                  alerta.criticidad === 'media' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${
                      alerta.criticidad === 'alta' ? 'bg-red-500' :
                      alerta.criticidad === 'media' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`}></span>
                    <span className="text-sm font-medium text-gray-900 capitalize">{alerta.tipo.replace('_', ' ')}</span>
                  </div>
                  <p className="text-sm text-gray-600">{alerta.mensaje}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No hay alertas activas</p>
          )}
        </div>
      </div>

      {/* Firmas Digitales */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Firmas Digitales</h3>
        <div className="space-y-4">
          {libroData.firmas.map((firma, index) => {
            const fechaFormateada = new Date(firma.fecha).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
            return (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{firma.seccion.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                      <p className="text-sm text-gray-500">Rol: {firma.rol}</p>
                      <p className="text-xs text-gray-400">ID: {firma.firmaId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{fechaFormateada}</p>
                    <p className="text-xs text-gray-500">Hash: {firma.hash}</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500">Usuario firmante:</span>
                  <p className="font-mono text-xs text-gray-600 bg-gray-50 p-1 rounded mt-1">{firma.usuarioId}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Documentos Adjuntos */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Documentos Adjuntos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {libroData.documentosAdjuntos.map((doc, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{doc.tipo.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                  <p className="text-xs text-gray-500">{doc.documentoId}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">{doc.formato}</span>
                <div className="flex items-center gap-2">
                  {doc.firmado && (
                    <span className="text-xs px-2 py-1 bg-green-100 rounded text-green-600">Firmado</span>
                  )}
                  <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">Ver</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Snapshot de Referencias */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Referencias del Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Certificados</h4>
            <div className="space-y-2">
              {libroData.snapshot.certificadosIds.map((id, index) => (
                <div key={index} className="text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded">
                  {id}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Intervenciones</h4>
            <div className="space-y-2">
              {libroData.snapshot.intervencionesIds.map((id, index) => (
                <div key={index} className="text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded">
                  {id}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Instalaciones</h4>
            <div className="space-y-2">
              {libroData.snapshot.instalacionesIds.map((id, index) => (
                <div key={index} className="text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded">
                  {id}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-100">
          <h4 className="font-medium text-gray-900 mb-3">Documentos del Sistema</h4>
          <div className="flex flex-wrap gap-2">
            {libroData.snapshot.documentosIds.map((id, index) => (
              <span key={index} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded border border-blue-200">
                {id}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones</h3>
        <div className="flex flex-wrap gap-3">
          <a 
            href={libroData.routes.descargarPdf}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Descargar PDF
          </a>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h4m-4 8h4m-4-4h4m-4-4h4m-4-4h4M8 4h4m-4 16h4m-4-8h4m-4-4h4m-4-4h4"/>
            </svg>
            Generar QR Final
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
            </svg>
            Exportar Datos
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Historial de Versiones
          </button>
          <a 
            href={libroData.routes.volverAlEdificio}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Volver al Edificio
          </a>
        </div>
      </div>
    </div>
  );
}
