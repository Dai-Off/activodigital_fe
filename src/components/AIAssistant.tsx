import { X, Send, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";

const CLASSIFIER_URL = "https://orquestador-clasificador-n8n-v2.fly.dev/webhook/agente-clasificador";

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

type AgentChunk = {
  type: string;
  content?: string;
  metadata?: Record<string, unknown>;
};

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

type ClassifierResponse = {
  success: boolean;
  tipo: 'redirect' | 'directo';
  categoria: 'financiero' | 'ambiental' | 'saludo' | 'fuera_scope';
  url?: string;
  prompt?: string;
  session_id?: string;
  respuesta?: string;
};

export function AIAssistant({ isOpen, onClose }: AIAssistantProps) {
  const { t } = useLanguage();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Un sessionId único por pestaña/sesión
  const sessionIdRef = useRef<string>(
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2)
  );
  const sessionId = sessionIdRef.current;

  // Auto-scroll cuando lleguen nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const createId = () => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
    return Math.random().toString(36).slice(2);
  };

  // Normalizar texto: quitar emojis, formatear saltos de línea
  const normalizeText = (text: string): string => {
    if (!text) return '';
    
    // Función para eliminar emojis de forma segura
    const removeEmojis = (str: string): string => {
      return str
        .replace(/[\u{1F300}-\u{1F9FF}]/gu, '') // Emojis Unicode
        .replace(/[\u{2600}-\u{26FF}]/gu, '')   // Símbolos
        .replace(/[\u{2700}-\u{27BF}]/gu, '')   // Dingbats
        .replace(/[\u2600-\u27BF]/g, '')        // Más símbolos
        .replace(/\p{Emoji_Presentation}/gu, '') // Emojis generales
        .replace(/\*\*/g, '')                   // Negritas markdown
        .replace(/###\s*/g, '')                 // Títulos markdown (###)
        .replace(/##\s*/g, '')                  // Títulos markdown (##)
        .replace(/#\s*/g, '');                  // Títulos markdown (#)
    };
    
    const cleaned = removeEmojis(text).trim();
    return cleaned;
  };

  // Renderizar contenido formateado
  const renderMessageContent = (content: string) => {
    if (!content) return null;
    
    const normalized = normalizeText(content);
    
    // Dividir por líneas
    const lines = normalized.split('\n').filter(line => line.trim());
    
    return (
      <div className="space-y-2">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          
          // Lista con guiones o números
          if (trimmed.match(/^[-•]\s/) || trimmed.match(/^\d+\.\s/)) {
            return (
              <div key={idx} className="flex gap-2 items-start">
                <span className="text-gray-400 mt-0.5">•</span>
                <span className="flex-1">{trimmed.replace(/^[-•]\s/, '').replace(/^\d+\.\s/, '')}</span>
              </div>
            );
          }
          
          // Títulos (líneas cortas seguidas de contenido)
          if (trimmed.length < 50 && trimmed.endsWith(':')) {
            return (
              <p key={idx} className="font-semibold text-gray-900 mt-3 first:mt-0">
                {trimmed}
              </p>
            );
          }
          
          // Texto normal
          return (
            <p key={idx} className="leading-relaxed">
              {trimmed}
            </p>
          );
        })}
      </div>
    );
  };

  const streamFromAgent = async (
    agentUrl: string,
    originalPrompt: string,
    assistantId: string
  ) => {
    try {
      const res = await fetch(agentUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatInput: originalPrompt,
          sessionId,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content:
                    text ||
                    `Error HTTP ${res.status}. No se pudo obtener respuesta del agente.`,
                  isStreaming: false,
                }
              : m
          )
        );
        return;
      }

      if (!res.body) {
        const text = await res.text().catch(() => "");
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: text || "", isStreaming: false } : m
          )
        );
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let buffer = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;

        if (value) {
          // acumulamos chunk en el buffer
          buffer += decoder.decode(value, { stream: !done });

          // separamos por líneas (NDJSON)
          const lines = buffer.split("\n");

          // la última línea puede estar incompleta → la dejamos en buffer
          if (!done) {
            buffer = lines.pop() || "";
          }

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            let obj: AgentChunk;
            try {
              obj = JSON.parse(trimmed);
            } catch {
              // si alguna línea viene cortada o mal formada, la ignoramos
              continue;
            }

            if (obj.type === "item" && obj.content) {
              // concatenamos el contenido al mensaje del assistant
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: (m.content || "") + obj.content }
                    : m
                )
              );
            }
          }
        }
      }

      // por si queda una última línea pendiente
      const last = buffer.trim();
      if (last) {
        try {
          const obj: AgentChunk = JSON.parse(last);
          if (obj.type === "item" && obj.content) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, content: (m.content || "") + obj.content }
                  : m
              )
            );
          }
        } catch {
          // ignoramos basura final
        }
      }

      // Marcar como finalizado el streaming
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, isStreaming: false }
            : m
        )
      );
    } catch (err) {
      console.error("Error en streamFromAgent:", err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content:
                  "Hubo un error al conectar con el agente. Por favor, intenta nuevamente.",
                isStreaming: false,
              }
            : m
        )
      );
    }
  };

  const handleSend = async () => {
    const prompt = message.trim();
    if (!prompt || loading) return;

    setMessage("");
    setLoading(true);

    const userId = createId();
    const assistantId = createId();

    // 1) agregamos el mensaje del usuario y uno vacío del asistente
    setMessages((prev) => [
      ...prev,
      { id: userId, role: "user", content: prompt },
      { id: assistantId, role: "assistant", content: "", isStreaming: true },
    ]);

    try {
      // PASO 1: Llamar al clasificador
      const classifierRes = await fetch(CLASSIFIER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt,
          session_id: sessionId,
        }),
      });

      if (!classifierRes.ok) {
        throw new Error(`Clasificador respondió con status ${classifierRes.status}`);
      }

      const classifierData: ClassifierResponse = await classifierRes.json();

      if (!classifierData.success) {
        throw new Error("El clasificador respondió con error");
      }

      console.log(`✅ Clasificador: ${classifierData.tipo} → ${classifierData.categoria}`);

      // PASO 2: Manejar respuesta según el tipo
      if (classifierData.tipo === 'directo') {
        // Respuesta directa (SALUDO o FUERA_SCOPE)
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: classifierData.respuesta || "Sin respuesta", isStreaming: false }
              : m
          )
        );
      } else if (classifierData.tipo === 'redirect') {
        // Redirect a agente específico (FINANCIERO o AMBIENTAL)
        if (!classifierData.url) {
          throw new Error("El clasificador no devolvió una URL válida");
        }
        console.log(`🔄 Redirigiendo a: ${classifierData.url}`);
        await streamFromAgent(classifierData.url, prompt, assistantId);
      } else {
        throw new Error(`Tipo de respuesta desconocido: ${classifierData.tipo}`);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content:
                  "Hubo un error al conectar con el agente. Revisá la consola para más detalles.",
                isStreaming: false,
              }
            : m
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-screen w-full md:w-96 bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h2 className="text-base">{t('aiAssistant', 'Asistente IA')}</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-md transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-400 px-4">
              <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">{t('startConversation', 'Inicia una conversación con el asistente')}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[80%] rounded-lg px-4 py-3 text-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-50 text-gray-800 border border-gray-200'
                  }`}
                >
                  {msg.content ? (
                    msg.role === 'user' ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      // Siempre formato estructurado limpio
                      renderMessageContent(msg.content)
                    )
                  ) : (loading && msg.role === 'assistant' ? (
                    <span className="inline-flex items-center gap-1 text-gray-400">
                      <span className="animate-pulse">•</span>
                      <span className="animate-pulse animation-delay-200">•</span>
                      <span className="animate-pulse animation-delay-400">•</span>
                    </span>
                  ) : '')}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-3 md:p-4">
        <div className="flex items-center gap-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('writeMessage', 'Escribe un mensaje...')}
            className="flex-1 px-3 md:px-4 py-2.5 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={1}
            style={{ minHeight: '42px', maxHeight: '120px' }}
          />
          <button
            onClick={handleSend}
            disabled={!message.trim() || loading}
            className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

