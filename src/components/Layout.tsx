import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';

type ChatMsg = {
  id: string;
  role: 'ai' | 'user';
  content: string;
  // demo de "generación de imagen" hardcoded
  imageSrc?: string;
  imageAlt?: string;
  toolCallPreview?: {
    name: string;
    params: Record<string, string | number | boolean>;
  };
};

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isChatOpen, setIsChatOpen] = useState(false);

  // Imagen DEMO (SVG inline) "generada"
  const demoGeneratedImage =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='960' height='540'>
        <defs>
          <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
            <stop stop-color='#0ea5e9' offset='0'/>
            <stop stop-color='#1d4ed8' offset='1'/>
          </linearGradient>
        </defs>
        <rect width='100%' height='100%' fill='#eef6ff'/>
        <g transform='translate(160,90)'>
          <rect x='0' y='0' width='640' height='360' rx='24' fill='url(#g)' opacity='0.08'/>
          <g transform='translate(80,40)'>
            <rect x='140' y='20' width='200' height='40' rx='8' fill='#0ea5e9' opacity='0.15'/>
            <rect x='120' y='80' width='240' height='220' rx='10' fill='#0ea5e9' opacity='0.12'/>
            <g fill='#0ea5e9'>
              <rect x='140' y='100' width='32' height='60' rx='4'/>
              <rect x='188' y='100' width='32' height='60' rx='4'/>
              <rect x='236' y='100' width='32' height='60' rx='4'/>
              <rect x='284' y='100' width='32' height='60' rx='4'/>
              <rect x='140' y='176' width='32' height='60' rx='4' opacity='0.85'/>
              <rect x='188' y='176' width='32' height='60' rx='4' opacity='0.85'/>
              <rect x='236' y='176' width='32' height='60' rx='4' opacity='0.85'/>
              <rect x='284' y='176' width='32' height='60' rx='4' opacity='0.85'/>
            </g>
            <rect x='220' y='244' width='32' height='56' rx='4' fill='#1d4ed8'/>
            <circle cx='236' cy='272' r='3' fill='white'/>
          </g>
        </g>
        <text x='50%' y='82%' text-anchor='middle' font-family='ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto' font-size='24' fill='#0f172a'>
          Mock: Render edificio minimalista en tonos azules
        </text>
      </svg>`
    );

  // Conversación hardcodeada (incluye toolCallPreview + imagen generada)
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: crypto.randomUUID(),
      role: 'ai',
      content: '¡Hola! Soy tu asistente. ¿En qué te ayudo hoy?',
    },
    {
      id: crypto.randomUUID(),
      role: 'user',
      content:
        'Necesito un mock de imagen para la portada del activo principal: un edificio minimalista en tonos azules.',
    },
    {
      id: crypto.randomUUID(),
      role: 'ai',
      content:
        'Perfecto. Voy a generar una imagen mock (demo) con un edificio minimalista, fondo claro y acentos en azul.',
      toolCallPreview: {
        name: 'image.generate',
        params: {
          prompt:
            'Edificio minimalista, estilo flat, paleta azules (#0EA5E9 / #1D4ED8), fondo claro, formato 16:9',
          size: '1280x720',
          style: 'clean',
          lighting: 'soft',
        },
      },
    },
    {
      id: crypto.randomUUID(),
      role: 'ai',
      content:
        'Aquí tienes una imagen DEMO incrustada (SVG) que simula el resultado de generación. Úsala solo como referencia visual.',
      imageSrc: demoGeneratedImage,
      imageAlt: 'Mock generado: edificio minimalista tonos azules',
    },
    {
      id: crypto.randomUUID(),
      role: 'user',
      content:
        'Se ve bien. ¿Puedes también incluirlo en la portada del documento de mantenimiento?',
    },
    {
      id: crypto.randomUUID(),
      role: 'ai',
      content:
        'Hecho. En tu documento de mantenimiento, coloca esta imagen en la sección de portada y añade título y fecha. ¿Quieres que te pase un template?',
    },
  ]);

  const [draft, setDraft] = useState('');
  const endRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isChatOpen]);

  useEffect(() => {
    if (!isChatOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsChatOpen(false);
    document.addEventListener('keydown', onKey);
    const t = setTimeout(() => inputRef.current?.focus(), 100);
    return () => {
      document.removeEventListener('keydown', onKey);
      clearTimeout(t);
    };
  }, [isChatOpen]);

  const cannedReplies = [
    'Entendido. ¿Puedes darme más contexto?',
    'Perfecto, preparo un borrador y te lo paso.',
    'Listo. ¿Quieres que lo optimice para móvil también?',
    'Quedó claro. Te doy pasos accionables en 1-2 puntos.',
  ];

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMsg = { id: crypto.randomUUID(), role: 'user', content: text.trim() };

    // DEMO: si el usuario escribe "genera imagen", respondemos con otra imagen mock
    const lower = text.toLowerCase();
    let aiMsg: ChatMsg;
    if (lower.includes('genera imagen') || lower.includes('genera una imagen')) {
      aiMsg = {
        id: crypto.randomUUID(),
        role: 'ai',
        content:
          'Generé otra variante DEMO (SVG inline). Recuerda que esto es solo un mock visual.',
        toolCallPreview: {
          name: 'image.generate',
          params: {
            prompt: 'Variante 2 — edificio minimalista, azul con gradiente, formato 16:9',
            size: '1280x720',
            style: 'clean',
          },
        },
        imageSrc: demoGeneratedImage,
        imageAlt: 'Mock generado 2: edificio minimalista tonos azules',
      };
    } else {
      aiMsg = {
        id: crypto.randomUUID(),
        role: 'ai',
        content: cannedReplies[Math.floor(Math.random() * cannedReplies.length)],
      };
    }

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setDraft('');
  };

  // Alto del footer (para no cubrirlo en móvil).
  const FOOTER_HEIGHT_PX = 88;

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
      {/* Header/Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 animate-slideDown">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm tracking-tight">LE</span>
                </div>
                <h1 className="text-xl font-semibold text-gray-900">Activo digital</h1>
              </div>
              <nav className="hidden md:flex space-x-6">
                <Link
                  to="/activos"
                  className={`nav-item pb-4 ${
                    isActive('/activos')
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Activos
                </Link>
                <Link
                  to="/documentos"
                  className={`nav-item pb-4 ${
                    isActive('/documentos')
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Documentación
                </Link>
                <Link
                  to="/mantenimiento"
                  className={`nav-item pb-4 ${
                    isActive('/mantenimiento')
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Mantenimiento
                </Link>
                <Link
                  to="/cumplimiento"
                  className={`nav-item pb-4 ${
                    isActive('/cumplimiento')
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Cumplimiento
                </Link>
                <Link
                  to="/unidades"
                  className={`nav-item pb-4 ${
                    isActive('/unidades')
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Unidades
                </Link>
              </nav>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Toggle Chat */}
              <button
                onClick={() => setIsChatOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-haspopup="dialog"
                aria-controls="chat-sidebar"
                aria-expanded={isChatOpen}
                title={isChatOpen ? 'Cerrar chat IA' : 'Abrir chat IA'}
              >
                {isChatOpen ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                    <span className="hidden sm:inline">Cerrar</span>
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                    </svg>
                    <span className="hidden sm:inline">Chat IA</span>
                  </>
                )}
              </button>

              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Notificaciones">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 01-3.46 0" />
                </svg>
              </button>

              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="7" r="4" />
                  <path d="M5.5 20a6.5 6.5 0 0113 0" />
                </svg>
              </div>

              <button
                onClick={() => {
                  try {
                    window.localStorage.removeItem('access_token');
                    window.sessionStorage.removeItem('access_token');
                  } catch {}
                  navigate('/login');
                }}
                className="group inline-flex items-center justify-center h-9 w-9 rounded-full border border-gray-200 bg-white text-gray-500 hover:text-red-600 hover:border-red-300 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                aria-label="Cerrar sesión"
                title="Cerrar sesión"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15l3-3m0 0l-3-3m3 3H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-6 flex-1">
        <div
          className={`
            relative
            md:grid
            transition-[grid-template-columns] duration-300 ease-out
            ${isChatOpen ? 'md:[grid-template-columns:1fr_24rem]' : 'md:[grid-template-columns:1fr_0]'}
          `}
        >
          {/* Contenido */}
          <section className="min-w-0">
            <Outlet />
          </section>

          {/* Chat (md+) */}
          <aside
            id="chat-sidebar"
            aria-label="Chat IA"
            className={`
              hidden md:flex md:flex-col md:border-l md:border-gray-200 md:bg-white
              md:h-[calc(100vh-64px)] md:sticky md:top-16
              overflow-hidden
              ${isChatOpen ? 'md:opacity-100' : 'md:opacity-0 pointer-events-none'}
              transition-opacity duration-300
            `}
          >
            {/* Header chat */}
            <div className="flex items-center justify-between px-4 h-14 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-md bg-blue-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20l9-5-9-5-9 5 9 5z" />
                    <path d="M12 12l9-5-9-5-9 5 9 5z" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-900">Chat IA</span>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Cerrar chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mensajes + input */}
            <div className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-blue-600 text-white rounded-br-sm'
                          : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                      }`}
                    >
                      {/* Contenido del mensaje */}
                      <div className="whitespace-pre-wrap">{m.content}</div>

                      {/* Vista previa de llamada a herramienta (mock) */}
                      {m.toolCallPreview && (
                        <div className="mt-2 rounded-md border border-gray-200 bg-white p-2 text-xs text-gray-700">
                          <div className="font-semibold text-gray-900 mb-1">{m.toolCallPreview.name}</div>
                          <div className="grid grid-cols-1 gap-1">
                            {Object.entries(m.toolCallPreview.params).map(([k, v]) => (
                              <div key={k} className="flex justify-between gap-2">
                                <span className="text-gray-500">{k}</span>
                                <span className="font-mono">{String(v)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Imagen generada (mock) */}
                      {m.imageSrc && (
                        <figure className="mt-2 overflow-hidden rounded-lg border border-gray-200">
                          <img src={m.imageSrc} alt={m.imageAlt || 'Imagen generada demo'} className="w-full h-auto block" />
                          {m.imageAlt && (
                            <figcaption className="px-2 py-1 text-[11px] text-gray-500 bg-gray-50 border-t border-gray-200">
                              {m.imageAlt}
                            </figcaption>
                          )}
                        </figure>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={endRef} />
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(draft);
                }}
                className="border-t border-gray-200 p-3"
              >
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder='Escribe tu mensaje... (prueba "genera imagen")'
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    title="Enviar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 2L11 13" />
                      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                    Enviar
                  </button>
                </div>
              </form>
            </div>
          </aside>

          {/* Overlay móvil (no cubre el footer) */}
          <div
            className={`
              fixed inset-x-0 top-16 z-40
              ${isChatOpen ? 'pointer-events-auto' : 'pointer-events-none'}
              md:hidden
            `}
            style={{ bottom: isChatOpen ? `${FOOTER_HEIGHT_PX}px` : '0px' }}
            aria-hidden={!isChatOpen}
          >
            {/* Backdrop */}
            <div
              onClick={() => setIsChatOpen(false)}
              className={`absolute inset-0 bg-black/30 transition-opacity ${isChatOpen ? 'opacity-100' : 'opacity-0'}`}
            />
            {/* Panel */}
            <div
              className={`
                absolute right-0 top-0 h-full w-full max-w-md bg-white border-l border-gray-200 shadow-xl
                transition-transform duration-300 ease-out
                ${isChatOpen ? 'translate-x-0' : 'translate-x-full'}
                flex flex-col
              `}
              role="dialog"
              aria-modal="true"
              aria-label="Chat IA"
            >
              <div className="flex items-center justify-between px-4 h-14 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-md bg-blue-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 20l9-5-9-5-9 5 9 5z" />
                      <path d="M12 12l9-5-9-5-9 5 9 5z" />
                    </svg>
                  </div>
                  <span className="font-semibold text-gray-900">Chat IA</span>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="rounded-md p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Cerrar chat"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-blue-600 text-white rounded-br-sm'
                          : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{m.content}</div>

                      {m.toolCallPreview && (
                        <div className="mt-2 rounded-md border border-gray-200 bg-white p-2 text-xs text-gray-700">
                          <div className="font-semibold text-gray-900 mb-1">{m.toolCallPreview.name}</div>
                          <div className="grid grid-cols-1 gap-1">
                            {Object.entries(m.toolCallPreview.params).map(([k, v]) => (
                              <div key={k} className="flex justify-between gap-2">
                                <span className="text-gray-500">{k}</span>
                                <span className="font-mono">{String(v)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {m.imageSrc && (
                        <figure className="mt-2 overflow-hidden rounded-lg border border-gray-200">
                          <img src={m.imageSrc} alt={m.imageAlt || 'Imagen generada demo'} className="w-full h-auto block" />
                          {m.imageAlt && (
                            <figcaption className="px-2 py-1 text-[11px] text-gray-500 bg-gray-50 border-t border-gray-200">
                              {m.imageAlt}
                            </figcaption>
                          )}
                        </figure>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={endRef} />
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(draft);
                }}
                className="border-t border-gray-200 p-3"
              >
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder='Escribe tu mensaje... (prueba "genera imagen")'
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    title="Enviar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 2L11 13" />
                      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                    Enviar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-blue-600/10 text-blue-700 flex items-center justify-center ring-1 ring-blue-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a4 4 0 01-4 4H8l-5 3V7a4 4 0 014-4h10a4 4 0 014 4v8z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">¿Necesitas ayuda con un activo o documento?</p>
                <p className="text-base font-semibold text-gray-900">Asistente IA</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsChatOpen((v) => !v)}
                aria-expanded={isChatOpen}
                aria-controls="chat-sidebar"
                className={`inline-flex items-center gap-2 rounded-lg text-sm font-medium px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${isChatOpen ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                {isChatOpen ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                    Cerrar chat
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                    </svg>
                    Abrir chat
                  </>
                )}
              </button>
              <a
                href="#top"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm px-3 py-2 hover:bg-gray-50"
                title="Volver arriba"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m18 15-6-6-6 6" />
                </svg>
                Arriba
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-sm">
            <div>
              <div className="mb-2 font-semibold text-gray-900">Producto</div>
              <ul className="space-y-1.5">
                <li>
                  <Link to="/activos" className="text-gray-600 hover:text-gray-900">
                    Activos
                  </Link>
                </li>
                <li>
                  <Link to="/documentos" className="text-gray-600 hover:text-gray-900">
                    Documentación
                  </Link>
                </li>
                <li>
                  <Link to="/mantenimiento" className="text-gray-600 hover:text-gray-900">
                    Mantenimiento
                  </Link>
                </li>
                <li>
                  <Link to="/cumplimiento" className="text-gray-600 hover:text-gray-900">
                    Cumplimiento
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="mb-2 font-semibold text-gray-900">Recursos</div>
              <ul className="space-y-1.5">
                <li>
                  <Link to="/ayuda" className="text-gray-600 hover:text-gray-900">
                    Centro de ayuda
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-gray-600 hover:text-gray-900">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/changelog" className="text-gray-600 hover:text-gray-900">
                    Changelog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="mb-2 font-semibold text-gray-900">Empresa</div>
              <ul className="space-y-1.5">
                <li>
                  <Link to="/sobre" className="text-gray-600 hover:text-gray-900">
                    Sobre nosotros
                  </Link>
                </li>
                <li>
                  <Link to="/contacto" className="text-gray-600 hover:text-gray-900">
                    Contacto
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="text-gray-600 hover:text-gray-900">
                    Trabaja con nosotros
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="mb-2 font-semibold text-gray-900">Legal</div>
              <ul className="space-y-1.5">
                <li>
                  <Link to="/terminos" className="text-gray-600 hover:text-gray-900">
                    Términos
                  </Link>
                </li>
                <li>
                  <Link to="/privacidad" className="text-gray-600 hover:text-gray-900">
                    Privacidad
                  </Link>
                </li>
                <li>
                  <Link to="/cookies" className="text-gray-600 hover:text-gray-900">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="mb-2 font-semibold text-gray-900">Contacto</div>
              <ul className="space-y-1.5">
                <li className="flex items-center gap-2 text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 6 12 13 2 6" />
                    <rect x="2" y="6" width="20" height="12" rx="2" />
                  </svg>
                  soporte@tudominio.com
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v.09a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012 4.18 2 2 0 014 2h.09A2 2 0 016 3.72c.2.74.47 1.45.82 2.12a2 2 0 01-.45 2.18L5.6 9.4a16 16 0 006 6l1.38-1.38a2 2 0 012.18-.45c.67.35 1.38.62 2.12.82A2 2 0 0121.91 16H22z" />
                  </svg>
                  +351 210 000 000
                </li>
              </ul>
            </div>
          </div>

          {/* Línea inferior */}
          <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-semibold text-gray-900">Activo digital</span>
              <span className="text-gray-300">•</span>
              <span>© {new Date().getFullYear()}</span>
              <span className="text-gray-300">•</span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-gray-700">Operativo</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <select
                className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700"
                defaultValue="es"
                aria-label="Idioma"
                title="Idioma"
              >
                <option value="es">ES</option>
                <option value="pt">PT</option>
                <option value="en">EN</option>
              </select>
              <button
                className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                title="Volver arriba"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m18 15-6-6-6 6" />
                </svg>
                Arriba
              </button>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideDown { animation: slideDown 0.6s ease-out; }
      `}</style>
    </div>
  );
}
