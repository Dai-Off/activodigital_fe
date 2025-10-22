
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import Footer from './Footer';
import { useAuth } from '../contexts/AuthContext';

/* ============================
   Types
============================= */
type ChatMsg = {
  id: string;
  role: 'ai' | 'user';
  content: string;
  imageSrc?: string;
  imageAlt?: string;
  toolCallPreview?: {
    name: string;
    params: Record<string, string | number | boolean>;
  };
};

type OrquestadorResponse = {
  respuesta: string;
  [k: string]: unknown;
};

/* ============================
   Constants
============================= */
const ORQUESTADOR_URL =
  'https://orquestador-clasificador-n8n-v2.fly.dev/webhook/agente-clasificador';
const FOOTER_HEIGHT_PX = 88;

/* ============================
   Markdown / HTML Utils
============================= */
function extractMarkdownImages(text: string): { alt: string; src: string }[] {
  const images: { alt: string; src: string }[] = [];
  const normalized = text.replace(/-\s*\n\s*!\[/g, '- ![');

  // ![alt](url)
  const imgMd = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match: RegExpExecArray | null;
  while ((match = imgMd.exec(normalized))) {
    images.push({ alt: match[1], src: match[2] });
  }

  // [alt](url) when url points to an image extension
  const linkImgMd =
    /\[([^\]]*)\]\(([^)]+\.(png|jpe?g|webp|gif|svg)(\?[^)]*)?)\)/gi;
  while ((match = linkImgMd.exec(normalized))) {
    images.push({ alt: match[1], src: match[2] });
  }
  return images;
}

function markdownTableToHtml(md: string): string {
  const tableRegex = /((?:^|\n)\|.+\|\n\|[-| :]+\|(?:\n\|.*\|)+)/g;
  return md.replace(tableRegex, (tableBlock) => {
    const lines = tableBlock.trim().split('\n').filter(Boolean);
    if (lines.length < 2) return tableBlock;
    const header = lines[0].split('|').slice(1, -1).map((h) => h.trim());
    const rows = lines
      .slice(2)
      .map((line) => line.split('|').slice(1, -1).map((cell) => cell.trim()));
    let html = '<table class="ai-table"><thead><tr>';
    html += header.map((h) => `<th>${h}</th>`).join('');
    html += '</tr></thead><tbody>';
    html += rows
      .map((row) => `<tr>${row.map((c) => `<td>${c}</td>`).join('')}</tr>`)
      .join('');
    html += '</tbody></table>';
    return html;
  });
}

function replaceTableImagesWithThumbnails(
  html: string,
  setModalImage: (img: { src: string; alt?: string }) => void
): React.ReactElement {
  if (typeof window === 'undefined') {
    // SSR safety: just render the raw HTML
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  }
  const parser = new window.DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  doc.querySelectorAll('td').forEach((td) => {
    const text = td.textContent || '';
    const imgs = extractMarkdownImages(text);
    if (!imgs.length) return;
    td.innerHTML = '';
    const seen = new Set<string>();
    imgs.forEach((img) => {
      if (seen.has(img.src)) return;
      seen.add(img.src);
      const span = doc.createElement('span');
      span.innerHTML = `<img src="${img.src}" alt="${img.alt || 'Imagen'}" style="width:64px;height:64px;object-fit:cover;border-radius:8px;cursor:pointer;border:1px solid #e5e7eb;margin:2px;" />`;
      // Attach click -> open modal (requires bridging to React)
      span.addEventListener('click', () => setModalImage({ src: img.src, alt: img.alt }));
      td.appendChild(span);
    });
  });

  return <span dangerouslySetInnerHTML={{ __html: doc.body.innerHTML }} />;
}

/* ============================
   JSON Parse Helpers
============================= */
function findBalancedJson(raw: string, startIdx: number): string | null {
  let depth = 0;
  let i = startIdx;
  let inStr = false;
  let esc = false;

  for (; i < raw.length; i++) {
    const ch = raw[i];
    if (inStr) {
      if (esc) {
        esc = false;
      } else if (ch === '\\') {
        esc = true;
      } else if (ch === '"') {
        inStr = false;
      }
      continue;
    } else {
      if (ch === '"') inStr = true;
      else if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (depth === 0) {
          return raw.slice(startIdx, i + 1);
        }
      }
    }
  }
  return null;
}

function parseLooselyForRespuesta(rawText: string): OrquestadorResponse | null {
  // Try direct JSON first
  try {
    const parsed = JSON.parse(rawText);
    if (parsed && typeof parsed === 'object' && typeof parsed.respuesta === 'string') {
      return parsed as OrquestadorResponse;
    }
  } catch {
    // continue to loose parsing
  }

  // Scan for first '{' and try to balance
  let idx = rawText.indexOf('{');
  while (idx !== -1) {
    const candidate = findBalancedJson(rawText, idx);
    if (candidate) {
      try {
        const parsed = JSON.parse(candidate);
        if (parsed && typeof parsed === 'object' && typeof parsed.respuesta === 'string') {
          return parsed as OrquestadorResponse;
        }
      } catch {
        // try next
      }
    }
    idx = rawText.indexOf('{', idx + 1);
  }

  // Last attempt: if we see {"success" ...} we still try to parse and accept it if object-y
  const guessStart = rawText.indexOf('{"success"');
  if (guessStart !== -1) {
    const candidate = findBalancedJson(rawText, guessStart);
    if (candidate) {
      try {
        const parsed = JSON.parse(candidate);
        if (parsed && typeof parsed === 'object') {
          // If there's no "respuesta", but we got an object, convert to string
          const fallback = (parsed as any).respuesta ?? JSON.stringify(parsed);
          return { respuesta: String(fallback), ...parsed };
        }
      } catch {
        // no-op
      }
    }
  }
  return null;
}

/* ============================
   Layout Component
============================= */
export default function Layout({ children }: { children?: React.ReactNode }) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatFullscreen, setIsChatFullscreen] = useState(false);
  const [modalImage, setModalImage] = useState<{ src: string; alt?: string } | null>(null);

  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [draft, setDraft] = useState('');
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);

  const endRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const sessionIdRef = useRef(`sess_${Date.now()}`);

  // Welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: crypto.randomUUID(),
          role: 'ai',
          content: t(
            'chatWelcome',
            '¡Hola! Soy tu asistente de activos digitales. ¿En qué puedo ayudarte hoy?'
          ),
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  // Scroll to bottom when messages or chat open state changes
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isChatOpen]);

  // Close chat on ESC when open
  useEffect(() => {
    if (!isChatOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsChatOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isChatOpen]);

  const isActive = (path: string) => location.pathname === path;

  /* ========== Send Message ========== */
  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    // Push user message
    const userMsg: ChatMsg = { id: crypto.randomUUID(), role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setDraft('');

    // Call orchestrator
    setIsLoadingResponse(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const payload = {
        session_id: sessionIdRef.current,
        user_id: user?.id ?? 'anon',
        message: trimmed,
        locale: navigator?.language ?? 'es',
      };

      const res = await fetch(ORQUESTADOR_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify(payload),
      });

      const rawText = await res.text();

      // Try JSON -> fallback loose parsing
      let parsed: OrquestadorResponse | null = null;
      try {
        parsed = JSON.parse(rawText);
      } catch {
        parsed = parseLooselyForRespuesta(rawText);
      }

      if (!parsed || typeof parsed.respuesta !== 'string') {
        // Fallback: show raw text if any
        const fallbackMsg = rawText?.trim()
          ? rawText.trim().slice(0, 4000)
          : t(
              'chatProcessingError',
              'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.'
            );

        const aiMsg: ChatMsg = { id: crypto.randomUUID(), role: 'ai', content: fallbackMsg };
        await new Promise((r) => setTimeout(r, 300));
        setMessages((prev) => [...prev, aiMsg]);
        return;
      }

      const aiMsg: ChatMsg = { id: crypto.randomUUID(), role: 'ai', content: parsed.respuesta };
      await new Promise((r) => setTimeout(r, 300));
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      const isAbort = error instanceof DOMException && error.name === 'AbortError';
      const errorMsg: ChatMsg = {
        id: crypto.randomUUID(),
        role: 'ai',
        content: isAbort
          ? t(
              'chatTimeoutError',
              'El servicio está tardando más de lo esperado. Intentá de nuevo en unos segundos.'
            )
          : t(
              'chatProcessingError',
              'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.'
            ),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      clearTimeout(timeout);
      setIsLoadingResponse(false);
    }
  };

  /* ========== Memoized message renderer ========== */
  const RenderMessageContent = useMemo(() => {
    return function RenderMessage({ m }: { m: ChatMsg }) {
      const containsTable = /\|.+\|\n\|[-| :]+\|/.test(m.content);
      const imgs = extractMarkdownImages(m.content);
      const hasImgs = imgs.length > 0;

      if (m.role === 'ai' && containsTable) {
        const html = markdownTableToHtml(m.content);
        return (
          <div className="whitespace-pre-wrap ai-markdown-table">
            {replaceTableImagesWithThumbnails(html, setModalImage)}
          </div>
        );
      }

      if (hasImgs) {
        const unique = Array.from(new Map(imgs.map((i) => [i.src, i])).values());
        const text = m.content
          .replace(/-\s*\n\s*!\[/g, '- ![')
          .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
          .replace(
            /\[[^\]]*\]\(([^)]+\.(png|jpe?g|webp|gif|svg)(\?[^)]*)?)\)/gi,
            ''
          )
          .trim();

        return (
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              {unique.map((img) => (
                <figure
                  key={img.src}
                  className="overflow-hidden rounded-lg border border-gray-200 cursor-pointer group"
                >
                  <img
                    src={img.src}
                    alt={img.alt || 'Imagen IA'}
                    className="w-32 h-32 object-cover block transition-transform group-hover:scale-105"
                    onClick={() => setModalImage({ src: img.src, alt: img.alt })}
                    style={{ maxWidth: 128, maxHeight: 128 }}
                  />
                  {img.alt && (
                    <figcaption className="px-2 py-1 text-[11px] text-gray-500 bg-gray-50 border-t border-gray-200">
                      {img.alt}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
            {text ? (
              <div className="whitespace-pre-wrap break-words overflow-auto">{text}</div>
            ) : null}
          </div>
        );
      }

      return <div className="whitespace-pre-wrap break-words overflow-auto">{m.content}</div>;
    };
  }, [setModalImage]);

  /* ========== JSX ========== */
  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
      {/* Header */}
      <header
        className={`bg-white border-b border-gray-200 sticky top-0 z-50 animate-slideDown ${
          isChatFullscreen ? 'hidden' : ''
        }`}
      >
        <div className="px-4 sm:px-6 lg:px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm tracking-tight">LE</span>
                </div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {t('appTitle', 'Activo digital')}
                </h1>
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
                  {t('assets', 'Activos')}
                  {isActive('/activos') && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
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
                  {t('documents', 'Documentación')}
                  {isActive('/documentos') && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
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
                  {t('maintenance', 'Mantenimiento')}
                  {isActive('/mantenimiento') && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
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
                  {t('compliance', 'Cumplimiento')}
                  {isActive('/cumplimiento') && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
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
                  {t('units', 'Unidades')}
                  {isActive('/unidades') && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
                  )}
                </Link>
              </nav>
            </div>

            <div className="flex items-center space-x-3">
              {/* Toggle Chat */}
              <button
                onClick={() => setIsChatOpen((v) => !v)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isChatOpen
                    ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                    : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                }`}
                aria-haspopup="dialog"
                aria-controls="chat-sidebar"
                aria-expanded={isChatOpen}
                title={isChatOpen ? t('closeChatTitle', 'Cerrar chat IA') : t('openChatTitle', 'Abrir chat IA')}
              >
                {isChatOpen ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                    <span className="hidden sm:inline">{t('close', 'Cerrar')}</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                    </svg>
                    <span className="hidden sm:inline">{t('chatAI', 'Chat IA')}</span>
                  </>
                )}
              </button>

              <button
                className="relative p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label={t('notifications', 'Notificaciones')}
                title={t('notifications', 'Notificaciones')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 01-3.46 0" />
                </svg>
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white" />
              </button>

              <LanguageSwitcher />

              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="7" r="4" />
                  <path d="M5.5 20a6.5 6.5 0 0113 0" />
                </svg>
              </div>

              <button
                onClick={() => {
                  try {
                    window.localStorage.removeItem('access_token');
                    window.sessionStorage.removeItem('access_token');
                  } catch {
                    // ignore
                  }
                  navigate('/login');
                }}
                className="group inline-flex items-center justify-center h-9 w-9 rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-red-600 hover:border-red-300 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
                aria-label={t('logout', 'Cerrar sesión')}
                title={t('logout', 'Cerrar sesión')}
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

      {/* Main */}
      <main className="px-4 sm:px-6 lg:px-4 pt-3 pb-6 flex-1">
        <div
          className={`relative transition-all duration-300 ease-out ${
            isChatOpen ? 'md:pr-96' : 'md:pr-0'
          }`}
        >
          {/* App Content */}
          <section className="min-w-0">
            {children ? children : <Outlet />}
          </section>

          {/* Desktop Chat Sidebar (md and up) */}
          <aside
            id="chat-sidebar"
            aria-label="Chat IA"
            className={`hidden md:flex md:flex-col md:border-l md:border-gray-200 md:bg-white
              ${isChatFullscreen ? 'fixed inset-0 z-[1100] w-screen h-screen top-0 left-0' : 'md:h-screen md:fixed md:right-0 md:top-0 md:z-40 md:w-96'}
              ${isChatOpen ? 'md:opacity-100' : 'md:opacity-0 pointer-events-none'}
              transition-all duration-300 bg-white`}
            style={isChatFullscreen ? { border: 'none', borderRadius: 0 } : {}}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-14 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-md bg-blue-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20l9-5-9-5-9 5 9 5z" />
                    <path d="M12 12l9-5-9-5-9 5 9 5z" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-900">{t('chatAI', 'Chat IA')}</span>
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

            {/* Messages */}
            <div className="flex-1 flex flex-col min-h-0">
              <div
                className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0 gn-chat-bg scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50"
                style={{ height: 'calc(100vh - 140px)', overflowY: 'auto' }}
              >
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-blue-600 text-white rounded-br-sm'
                          : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                      }`}
                    >
                      <RenderMessageContent m={m} />

                      {m.toolCallPreview && (
                        <div className="mt-2 rounded-md border border-gray-200 bg-white p-2 text-xs text-gray-700">
                          <div className="font-semibold text-gray-900 mb-1">
                            {m.toolCallPreview.name}
                          </div>
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
                        <figure className="mt-2 overflow-hidden rounded-lg border border-gray-200 cursor-pointer group">
                          <img
                            src={m.imageSrc}
                            alt={m.imageAlt || 'Imagen generada demo'}
                            className="w-32 h-32 object-cover block transition-transform group-hover:scale-105"
                            onClick={() => setModalImage({ src: m.imageSrc!, alt: m.imageAlt })}
                            style={{ maxWidth: 128, maxHeight: 128 }}
                          />
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
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={endRef} />
              </div>

              {/* Input */}
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
                    placeholder={t('chatPlaceholder', 'Escribe tu mensaje...')}
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
                    {t('send', 'Enviar')}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsChatFullscreen((f) => !f)}
                    className="rounded-md p-2 ml-1 bg-white border border-gray-300 text-blue-600 hover:bg-blue-50 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    aria-label={
                      isChatFullscreen ? t('exitFullscreen', 'Salir de pantalla completa') : t('fullscreen', 'Pantalla completa')
                    }
                    title={
                      isChatFullscreen ? t('exitFullscreen', 'Salir de pantalla completa') : t('fullscreen', 'Pantalla completa')
                    }
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 40 }}
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

          {/* Mobile overlay (does not push layout; footer stays below everything) */}
          <div
            className={`fixed inset-x-0 top-16 z-40 md:hidden ${
              isChatOpen ? 'pointer-events-auto' : 'pointer-events-none'
            } ${isChatFullscreen ? 'fixed inset-0 top-0 left-0 h-screen w-screen z-[1100]' : ''}`}
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
              className={`absolute right-0 top-0 h-full w-full max-w-md bg-white border-l border-gray-200 shadow-xl
                transition-transform duration-300 ease-out
                ${isChatOpen ? 'translate-x-0' : 'translate-x-full'}
                flex flex-col
                ${isChatFullscreen ? '!max-w-none !w-screen !h-screen !border-0 !rounded-none !fixed !top-0 !left-0 !z-[1100]' : ''}`}
              role="dialog"
              aria-modal="true"
              aria-label="Chat IA"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 h-14 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-md bg-blue-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 20l9-5-9-5-9 5 9 5z" />
                      <path d="M12 12l9-5-9-5-9 5 9 5z" />
                    </svg>
                  </div>
                  <span className="font-semibold text-gray-900">{t('chatAI', 'Chat IA')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsChatFullscreen((f) => !f)}
                    className="rounded-md p-2 bg-white border border-gray-300 text-blue-600 hover:bg-blue-50 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    aria-label={
                      isChatFullscreen ? t('exitFullscreen', 'Salir de pantalla completa') : t('fullscreen', 'Pantalla completa')
                    }
                    title={
                      isChatFullscreen ? t('exitFullscreen', 'Salir de pantalla completa') : t('fullscreen', 'Pantalla completa')
                    }
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
                    aria-label={t('close', 'Cerrar')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 flex flex-col min-h-0">
                <div
                  className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0 gn-chat-bg scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50"
                  style={{ height: 'calc(100vh - 140px)', overflowY: 'auto' }}
                >
                  {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                          m.role === 'user'
                            ? 'bg-blue-600 text-white rounded-br-sm'
                            : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                        }`}
                      >
                        <RenderMessageContent m={m} />

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
                          <figure className="mt-2 overflow-hidden rounded-lg border border-gray-200 cursor-pointer group">
                            <img
                              src={m.imageSrc}
                              alt={m.imageAlt || 'Imagen generada demo'}
                              className="w-32 h-32 object-cover block transition-transform group-hover:scale-105"
                              onClick={() => setModalImage({ src: m.imageSrc!, alt: m.imageAlt })}
                              style={{ maxWidth: 128, maxHeight: 128 }}
                            />
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
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={endRef} />
                </div>

                {/* Input */}
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
                      placeholder={t('chatPlaceholder', 'Escribe tu mensaje...')}
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
                      {t('send', 'Enviar')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Image Modal (shared) */}
          {modalImage && (
            <div
              className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 cursor-zoom-out animate-fadeIn"
              onClick={() => setModalImage(null)}
              tabIndex={-1}
              aria-modal="true"
              role="dialog"
            >
              <img
                src={modalImage.src}
                alt={modalImage.alt || 'Imagen'}
                className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl border-4 border-white"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                className="absolute top-6 right-6 text-white bg-black/60 rounded-full p-2 hover:bg-black/80 focus:outline-none"
                onClick={() => setModalImage(null)}
                aria-label={t('closeImage', 'Cerrar imagen')}
                style={{ zIndex: 2100 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer (always at the very bottom) */}
      <Footer />

      {/* Styles */}
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

        @keyframes gn-auroraFlow {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 100%; }
        }
        .gn-chat-bg {
          background:
            radial-gradient(900px 600px at 15% 25%, rgba(38,100,255,0.25), transparent 60%),
            radial-gradient(900px 600px at 85% 75%, rgba(124,58,237,0.25), transparent 60%),
            #F4F6FA;
          background-size: 200% 200%;
          animation: gn-auroraFlow 16s ease-in-out infinite;
          position: relative;
          overflow: hidden;
        }
        .gn-chat-bg > * { position: relative; z-index: 1; }

        /* Simple fade for modal */
        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }
        .animate-fadeIn { animation: fadeIn .2s ease-out; }
      `}</style>
    </div>
  );
}