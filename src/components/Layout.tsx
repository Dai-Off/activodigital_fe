import { useEffect, useRef, useState } from 'react';
// Utilidad simple para convertir tablas markdown a HTML
function markdownTableToHtml(md: string): string {
  // Busca bloques de tabla markdown
  const tableRegex = /((?:^|\n)\|.+\|\n\|[-| :]+\|(?:\n\|.*\|)+)/g;
  return md.replace(tableRegex, (tableBlock) => {
    const lines = tableBlock.trim().split('\n').filter(Boolean);
    if (lines.length < 2) return tableBlock; // No es tabla válida
    const header = lines[0].split('|').slice(1, -1).map((h) => h.trim());
    const rows = lines.slice(2).map(line => line.split('|').slice(1, -1).map(cell => cell.trim()));
    let html = '<table class="ai-table"><thead><tr>';
    html += header.map(h => `<th>${h}</th>`).join('');
    html += '</tr></thead><tbody>';
    html += rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('');
    html += '</tbody></table>';
    return html;
  });
}
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import Footer from './Footer';
import { useAuth } from '../contexts/AuthContext';
import NotificationBell from './ui/NotificationBell';
import DiscreteNotification from './ui/DiscreteNotification';

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

// URL del orquestador
const ORQUESTADOR_URL = 'https://orquestador-clasificador-n8n-v2.fly.dev/webhook/agente-clasificador';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatFullscreen, setIsChatFullscreen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: crypto.randomUUID(),
      role: 'ai',
      content: '¡Hola! Soy tu asistente de activos digitales. ¿En qué puedo ayudarte hoy?',
    },
  ]);

  const [draft, setDraft] = useState('');
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const sessionIdRef = useRef(`sess_${Date.now()}`);

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

  // Efecto para resetear fullscreen cuando se cierra el chat
  useEffect(() => {
    if (!isChatOpen && isChatFullscreen) {
      setIsChatFullscreen(false);
    }
  }, [isChatOpen, isChatFullscreen]);


  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoadingResponse) return;
    
    // Verificar que el usuario esté autenticado
    if (!user || !user.userId) {
      const errorMsg: ChatMsg = {
        id: crypto.randomUUID(),
        role: 'ai',
        content: 'Error: No se pudo identificar tu usuario. Por favor, intenta iniciar sesión nuevamente.',
      };
      setMessages((prev) => [...prev, errorMsg]);
      return;
    }

    const userMsg: ChatMsg = { id: crypto.randomUUID(), role: 'user', content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setDraft('');
    setIsLoadingResponse(true);

    const requestBody = {
      prompt: text.trim(),
      usuario_id: user.userId,
      session_id: sessionIdRef.current,
    };
    console.log('📤 Enviando al orquestador:', requestBody);

    try {
      // Timeout largo para n8n (puede tardar bastante). Subido a 120s
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000);

      const response = await fetch(ORQUESTADOR_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*',
        },
        mode: 'cors',
        cache: 'no-store',
        signal: controller.signal,
        body: JSON.stringify(requestBody),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      // Hay respuestas que vienen con ruido antes/después del JSON (ej: texto + JSON pegado)
      // Leemos como texto crudo (usando clone para mayor compatibilidad) y tratamos de extraer JSON.
      let rawText = '';
      try {
        rawText = await response.clone().text();
      } catch {
        try {
          const buf = await response.arrayBuffer();
          rawText = new TextDecoder('utf-8').decode(buf);
        } catch {
          rawText = '';
        }
      }
      console.log('📥 Respuesta RAW del orquestador:', rawText);

      // Si la respuesta está vacía, esperar un poco más y reintentar
      if (!rawText || rawText.trim() === '') {
        console.log('⚠️ Respuesta vacía, esperando respuesta del servidor...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Reintentar la lectura
        try {
          rawText = await response.clone().text();
          console.log('📥 Respuesta RAW (reintento):', rawText);
        } catch {
          // Si sigue vacía, continuar con el flujo normal
        }
        if (!rawText || rawText.trim() === '') {
          throw new Error('Body vacío: es probable que el webhook haya respondido con múltiples items o sin CORS.');
        }
      }

      let dataParsed: unknown = null;
      // 1) Intento directo
      try {
        dataParsed = JSON.parse(rawText);
      } catch {
        // Ignorar error de parseo directo; intentaremos extraer JSON embebido
      }

      // 2) Si falla, buscar el último bloque que parsee a JSON válido
      if (!dataParsed || typeof dataParsed !== 'object') {
        // Estrategia ultra-tolerante: desde cada '{', balancear llaves hasta el '}' correspondiente
        const findBalancedJson = (text: string, startIdx: number): string | null => {
          let depth = 0;
          for (let i = startIdx; i < text.length; i++) {
            const ch = text[i];
            if (ch === '{') depth++;
            if (ch === '}') {
              depth--;
              if (depth === 0) return text.slice(startIdx, i + 1);
            }
          }
          return null;
        };

        let idx = rawText.indexOf('{');
        while (idx !== -1) {
          const candidate = findBalancedJson(rawText, idx);
          if (candidate) {
            try {
              const parsed = JSON.parse(candidate);
              if (parsed && typeof parsed === 'object' && ('respuesta' in parsed || 'success' in parsed)) {
                dataParsed = parsed;
                break;
              }
            } catch {
              // probar siguiente '{'
            }
          }
          idx = rawText.indexOf('{', idx + 1);
        }

        // Último recurso: si no se pudo parsear pero hay una línea que empieza con {"success",
        if (!dataParsed) {
          const guessStart = rawText.indexOf('{"success"');
          if (guessStart !== -1) {
            const candidate = findBalancedJson(rawText, guessStart);
            if (candidate) {
              try {
                const parsed = JSON.parse(candidate);
                if (parsed && typeof parsed === 'object') dataParsed = parsed;
              } catch {
                // no-op
              }
            }
          }
        }
      }

      console.log('📥 Respuesta parsed del orquestador:', dataParsed);

      // Verificar que la respuesta tenga el formato esperado
      type OrquestadorResponse = { respuesta: string; [k: string]: unknown };
      const hasRespuesta = (() => {
        if (!dataParsed || typeof dataParsed !== 'object') return false;
        const maybe = dataParsed as Partial<OrquestadorResponse>;
        return typeof maybe.respuesta === 'string';
      })();

      if (!hasRespuesta) {
        console.error('❌ Respuesta inválida (tras parseo flexible):', dataParsed);
        console.error('❌ Raw text que causó el error:', rawText);
        throw new Error('Respuesta inválida del servidor (no se encontró campo "respuesta").');
      }

      const data = dataParsed as OrquestadorResponse;

      const aiMsg: ChatMsg = {
        id: crypto.randomUUID(),
        role: 'ai',
        content: data.respuesta,
      };

      // Pequeño retraso mínimo para UX (el servicio suele tardar segundos)
      await new Promise((r) => setTimeout(r, 300));
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      const isAbort = error instanceof DOMException && error.name === 'AbortError';
      if (isAbort) {
        console.error('⏱️ Tiempo de espera agotado esperando respuesta del orquestador.');
      } else {
        console.error('Error al llamar al orquestador:', error);
      }
      const errorMsg: ChatMsg = {
        id: crypto.randomUUID(),
        role: 'ai',
        content: isAbort
          ? 'El servicio está tardando más de lo esperado. Intentá de nuevo en unos segundos.'
          : 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoadingResponse(false);
    }
  };

  // Alto del footer (para no cubrirlo en móvil).
  const FOOTER_HEIGHT_PX = 88;

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
      {/* Header/Navbar */}
  <header className={`bg-white border-b border-gray-200 sticky top-0 z-50 animate-slideDown ${isChatFullscreen ? 'hidden' : ''}`}> 
        <div className="px-4 sm:px-6 lg:px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm tracking-tight">LE</span>
                </div>
                <h1 className="text-xl font-semibold text-gray-900">Activo digital</h1>
              </div>
              <nav className="hidden md:flex space-x-1">
                <Link
                  to="/activos"
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/activos')
                      ? 'text-blue-600 bg-blue-50 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Activos
                  {isActive('/activos') && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                  )}
                </Link>
                <Link
                  to="/documentos"
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/documentos')
                      ? 'text-blue-600 bg-blue-50 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Documentación
                  {isActive('/documentos') && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                  )}
                </Link>
                <Link
                  to="/mantenimiento"
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/mantenimiento')
                      ? 'text-blue-600 bg-blue-50 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Mantenimiento
                  {isActive('/mantenimiento') && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                  )}
                </Link>
                <Link
                  to="/cumplimiento"
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/cumplimiento')
                      ? 'text-blue-600 bg-blue-50 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Cumplimiento
                  {isActive('/cumplimiento') && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                  )}
                </Link>
                <Link
                  to="/unidades"
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/unidades')
                      ? 'text-blue-600 bg-blue-50 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Unidades
                  {isActive('/unidades') && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                  )}
                </Link>
              </nav>
            </div>

            <div className="flex items-center space-x-2">
              {/* Toggle Chat */}
              <button
                onClick={() => setIsChatOpen((v) => !v)}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isChatOpen
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
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

              {/* Botón de notificaciones */}
              <NotificationBell />

              {/* Botón de perfil */}
              <button
                className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                aria-label="Perfil"
                title="Perfil"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="7" r="4" />
                  <path d="M5.5 20a6.5 6.5 0 0113 0" />
                </svg>
              </button>

              {/* Botón de cerrar sesión */}
              <button
                onClick={() => {
                  try {
                    window.localStorage.removeItem('access_token');
                    window.sessionStorage.removeItem('access_token');
                  } catch {
                    // Ignorar errores de storage
                  }
                  navigate('/login');
                }}
                className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-gray-50 text-gray-600 hover:text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
                aria-label="Cerrar sesión"
                title="Cerrar sesión"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15l3-3m0 0l-3-3m3 3H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="px-4 sm:px-6 lg:px-4 pt-3 pb-6 flex-1">
        <div
          className={`
            relative
            transition-all duration-300 ease-out
            ${isChatOpen ? 'md:pr-96' : 'md:pr-0'}
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
              ${isChatFullscreen ? 'fixed inset-0 z-[1100] w-screen h-screen md:w-screen md:h-screen top-0 left-0' : 'md:h-screen md:fixed md:right-0 md:top-0 md:z-40 md:w-96'}
              ${isChatOpen ? 'md:opacity-100' : 'md:opacity-0 pointer-events-none'}
              transition-all duration-300 bg-white
            `}
            style={isChatFullscreen ? { border: 'none', borderRadius: 0 } : {}}
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
              <div className="flex items-center gap-1">
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
            </div>

            {/* Mensajes + input */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0 chat-background" style={{ height: 'calc(100vh - 140px)' }}>
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
                      {/* Renderiza tablas markdown como HTML si existen */}
                      {m.role === 'ai' && /\|.+\|\n\|[-| :]+\|/.test(m.content) ? (
                        <div
                          className="whitespace-pre-wrap ai-markdown-table"
                          dangerouslySetInnerHTML={{ __html: markdownTableToHtml(m.content) }}
                        />
                      ) : (
                        <div className="whitespace-pre-wrap">{m.content}</div>
                      )}

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
                {isLoadingResponse && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed bg-gray-100 text-gray-800 rounded-bl-sm">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
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
                    placeholder="Escribe tu mensaje..."
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoadingResponse}
                  />
                  <button
                    type="submit"
                    disabled={isLoadingResponse || !draft.trim()}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Enviar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 2L11 13" />
                      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                    Enviar
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsChatFullscreen(f => !f)}
                    className="rounded-md p-2 ml-1 bg-white border border-gray-300 text-blue-600 hover:bg-blue-50 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    aria-label={isChatFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
                    title={isChatFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40px' }}
                  >
                    {isChatFullscreen ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 15v5h5M20 9V4h-5M4 4l7 7M20 20l-7-7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 9V4h5M20 15v5h-5M4 4l7 7M20 20l-7-7" />
                      </svg>
                    )}
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
              ${isChatFullscreen ? 'fixed inset-0 top-0 left-0 h-screen w-screen z-[1100]' : ''}
            `}
            style={isChatFullscreen ? { bottom: 0 } : { bottom: isChatOpen ? `${FOOTER_HEIGHT_PX}px` : '0px' }}
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
                ${isChatFullscreen ? '!max-w-none !w-screen !h-screen !border-0 !rounded-none !fixed !top-0 !left-0 !z-[1100]' : ''}
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
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsChatFullscreen(f => !f)}
                    className="rounded-md p-2 bg-white border border-gray-300 text-blue-600 hover:bg-blue-50 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    aria-label={isChatFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
                    title={isChatFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {isChatFullscreen ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 15v5h5M20 9V4h-5M4 4l7 7M20 20l-7-7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 9V4h5M20 15v5h-5M4 4l7 7M20 20l-7-7" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setIsChatFullscreen(false);
                      setIsChatOpen(false);
                    }}
                    className="rounded-md p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Cerrar chat"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0 chat-background" style={{ height: 'calc(100vh - 140px)' }}>
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-blue-600 text-white rounded-br-sm'
                          : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                      }`}
                    >
                      {m.role === 'ai' && /\|.+\|\n\|[-| :]+\|/.test(m.content) ? (
                        <div
                          className="whitespace-pre-wrap ai-markdown-table"
                          dangerouslySetInnerHTML={{ __html: markdownTableToHtml(m.content) }}
                        />
                      ) : (
                        <div className="whitespace-pre-wrap">{m.content}</div>
                      )}

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
                {isLoadingResponse && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed bg-gray-100 text-gray-800 rounded-bl-sm">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
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
                      placeholder="Escribe tu mensaje..."
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isLoadingResponse}
                    />
                    <button
                      type="submit"
                      disabled={isLoadingResponse || !draft.trim()}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
        </div>
      </main>

      <div className={`transition-all duration-300 ease-out ${isChatOpen ? 'md:pr-96' : 'md:pr-0'}`}>
        <Footer />
      </div>

      {/* Componente discreto de notificaciones */}
      <DiscreteNotification />

      <style>{`
        .ai-table { border-collapse: collapse; width: 100%; margin: 0.5em 0; font-size: 0.95em; }
        .ai-table th, .ai-table td { border: 1px solid #d1d5db; padding: 0.4em 0.7em; text-align: left; }
        .ai-table th { background: #f3f4f6; font-weight: 600; }
        .ai-table tr:nth-child(even) td { background: #f9fafb; }
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideDown { animation: slideDown 0.6s ease-out; }
        
        /* Fondo del chat: gradiente suave (verde -> azul -> lila) inspirado en la imagen */
        .chat-background {
          position: relative;
          overflow: hidden;
          /* Capa base (dirección 120deg) */
          background: linear-gradient(120deg, #d9fbe7 0%, #cfeffd 40%, #e7dcff 100%);
          /* Mezcla extra sutil para dar luz central (radial + transparencia) */
          background-image:
            radial-gradient(circle at 25% 70%, rgba(255,255,255,0.7), rgba(255,255,255,0) 60%),
            linear-gradient(120deg, #d9fbe7 0%, #cfeffd 40%, #e7dcff 100%);
          background-blend-mode: overlay, normal;
        }
        /* Eliminar decoraciones anteriores (nubes/skyline) */
        .chat-background::before,
        .chat-background::after {
          content: none !important;
        }
        /* Asegurar stacking normal de los elementos internos */
        .chat-background > * { position: relative; z-index: 1; }
      `}</style>
    </div>
  );
}
