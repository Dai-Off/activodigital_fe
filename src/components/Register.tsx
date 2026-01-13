import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  signupRequest,
  validateInvitation,
  signupWithInvitation,
  setup2FA,
  verify2FASetup,
  verify2FALogin,
} from "../services/auth";
import { useAuth } from "../contexts/AuthContext";
import { FormLoader, useLoadingState } from "./ui/LoadingSystem";
import QRCode from "react-qr-code";

export default function Register() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();

  // Soportar distintos nombres de query param por invitación
  const token =
    searchParams.get("token") ||
    searchParams.get("invitation_token") ||
    searchParams.get("invite");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const { loading, error, startLoading, stopLoading } = useLoadingState();
  const [success, setSuccess] = useState<string | null>(null);
  const [hasInvitation, setHasInvitation] = useState(false);

  // Estados para 2FA
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [manualEntryKey, setManualEntryKey] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [verifying2FA, setVerifying2FA] = useState(false);
  const [error2FA, setError2FA] = useState("");
  const [tempUserId, setTempUserId] = useState("");
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [tempPassword, setTempPassword] = useState(""); // Guardar password temporalmente para login después del setup

  // Verificar y precargar datos por invitación
  useEffect(() => {
    let isMounted = true;
    if (!token) return;

    (async () => {
      try {
        const response = await validateInvitation(token);
        if (!isMounted) return;

        if (response?.success && response?.invitation) {
          setHasInvitation(true);
          if (response.invitation.email) setEmail(response.invitation.email);
        } else {
          // Token inválido/expirado
          setHasInvitation(false);
        }
      } catch (err) {
        console.error("Error validating invitation token:", err);
        setHasInvitation(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [token]);

  // Helper para mostrar error en banner
  const setError = (message: string) => {
    stopLoading(message || t("unknownError", "Ocurrió un error"));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(null);

    if (!name.trim())
      return setError(t("nameRequired", "El nombre es obligatorio"));
    if (!email.trim())
      return setError(t("emailRequired", "El correo es obligatorio"));
    if (password.length < 8)
      return setError(
        t("passwordMin", "La contraseña debe tener al menos 8 caracteres")
      );
    if (password !== password2)
      return setError(t("passwordMismatch", "Las contraseñas no coinciden"));

    startLoading();

    try {
      let userId = "";

      if (hasInvitation && token) {
        // Registro con invitación
        const response = await signupWithInvitation({
          email,
          password,
          full_name: name,
          invitation_token: token,
        });

        userId = response.user.id;
      } else {
        // Registro normal
        const signupResponse = await signupRequest({
          email,
          password,
          full_name: name,
        });

        // El backend devuelve directamente el userId
        userId = signupResponse.userId || "";

        if (!userId) {
          throw new Error("No se pudo obtener el ID de usuario");
        }
      }

      // Setup 2FA obligatorio
      const setup2FAResponse = await setup2FA(userId);
      setQrCodeUrl(setup2FAResponse.qrCodeUrl);
      setManualEntryKey(setup2FAResponse.manualEntryKey);
      setTempUserId(userId);
      // Guardar password temporalmente para login después del setup
      setTempPassword(password);

      stopLoading();
      setShow2FASetup(true);
    } catch (err) {
      console.error(err);
      stopLoading();
      setError(
        (err as any)?.message || t("signupError", "Error al crear la cuenta")
      );
    }
  }

  // Verificar código 2FA y completar registro
  async function handle2FAVerification(e: React.FormEvent) {
    e.preventDefault();

    if (twoFactorCode.length !== 6) {
      setError2FA(t("invalid2FACodeLength", "El código debe tener 6 dígitos"));
      return;
    }

    setVerifying2FA(true);
    setError2FA("");

    try {
      // Primero verificar el setup 2FA
      const verifyResponse = await verify2FASetup({
        userId: tempUserId,
        token: twoFactorCode,
      });

      if (verifyResponse.success) {
        // Setup verificado exitosamente - ahora hacer login automáticamente
        try {
          console.log("Setup 2FA verificado, haciendo login automático...");

          // Verificar con 2FA y password - el backend crea la sesión internamente
          const login2FAResponse = await verify2FALogin({
            email,
            token: twoFactorCode,
            password: tempPassword,
          });

          console.log("Respuesta verify2FALogin:", login2FAResponse);

          if (login2FAResponse.success && login2FAResponse.access_token) {
            // Login exitoso con 2FA
            const token = login2FAResponse.access_token;
            console.log("Token recibido, guardando...");

            // Guardar token en localStorage
            localStorage.setItem("access_token", token);

            // Limpiar password temporal
            setTempPassword("");

            console.log("Haciendo login en el contexto...");

            // Hacer login en el contexto y esperar a que se complete
            await login(token);

            console.log(
              "Login en contexto completado, obteniendo info del usuario..."
            );

            // Esperar un momento para asegurar que todo esté listo
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Redirigir al dashboard
            console.log("Redirigiendo...");
            navigate("/dashboard");
          } else {
            console.error(
              "verify2FALogin no devolvió access_token:",
              login2FAResponse
            );
            setError2FA(
              t(
                "loginError",
                "Error al iniciar sesión después del registro. Por favor inicia sesión manualmente."
              )
            );

            // Redirigir al login después de un tiempo
            setTimeout(() => {
              navigate(`/login?email=${encodeURIComponent(email)}`);
            }, 3000);
          }
        } catch (loginErr: any) {
          console.error("Error en login después del setup:", loginErr);
          setError2FA(
            t("loginError", "Error al iniciar sesión. Redirigiendo al login...")
          );

          // Redirigir al login después de un tiempo
          setTimeout(() => {
            navigate(`/login?email=${encodeURIComponent(email)}`);
          }, 3000);
        }
      } else {
        setError2FA(
          verifyResponse.message ||
            t("invalid2FACode", "Código inválido. Intenta nuevamente.")
        );
      }
    } catch (err: any) {
      console.error("Error 2FA:", err);
      const errorMessage =
        err?.body?.message ||
        err?.message ||
        t("invalid2FACode", "Código inválido. Intenta nuevamente.");
      setError2FA(errorMessage);
    } finally {
      setVerifying2FA(false);
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(manualEntryKey);
    setSuccess(t("keyCopied", "Clave copiada"));
    setTimeout(() => setSuccess(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fadeInUp">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-3">
            <span className="text-white font-semibold">LE</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {t("registerTitle", "Crear cuenta")}
          </h1>
          <p className="text-gray-600 mt-1">
            {t("registerSubtitle", "Regístrate para comenzar")}
          </p>
        </div>

        <div
          className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm animate-fadeInUp"
          style={{ animationDelay: "0.05s" }}
        >
          {hasInvitation && (
            <div className="mb-4 p-3 rounded-lg border border-blue-200 bg-blue-50 text-sm text-blue-800">
              <strong>{t("inviteDetected", "Invitación detectada")}:</strong>{" "}
              {t(
                "inviteInfo",
                "Has sido invitado a unirte a la plataforma. El email ya está predefinido y se usará el rol de la invitación."
              )}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-800">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-lg border border-green-200 bg-green-50 text-sm text-green-800">
              {success}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("nameLabel", "Nombre")}
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder={t("namePlaceholder", "Tu nombre")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("emailLabel", "Correo electrónico")}
              </label>
              {hasInvitation ? (
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="w-full rounded-lg border-gray-300 bg-gray-50 text-gray-600"
                  value={email}
                  readOnly
                  title={t(
                    "inviteEmailTitle",
                    "El email está predefinido por la invitación"
                  )}
                />
              ) : (
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="tucorreo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              )}
              {hasInvitation && (
                <p className="mt-1 text-xs text-gray-500">
                  {t(
                    "inviteEmailHint",
                    "Este email está definido por la invitación"
                  )}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("passwordLabel", "Contraseña")}
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                htmlFor="password2"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("repeatPasswordLabel", "Repetir contraseña")}
              </label>
              <input
                id="password2"
                type="password"
                autoComplete="new-password"
                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="••••••••"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full inline-flex justify-center items-center gap-2 rounded-lg text-white font-semibold py-2.5 transition-colors ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <FormLoader message={t("creating", "Creando cuenta...")} />
              ) : (
                t("create", "Crear cuenta")
              )}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            {t("haveAccount", "¿Ya tienes cuenta?")}{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {t("login", "Inicia sesión")}
            </Link>
          </p>
        </div>

        {/* Modal de Setup 2FA */}
        {show2FASetup && (
          <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl border border-gray-200 animate-fadeInUp">
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 border-2 border-green-100">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {t(
                    "setup2FATitle",
                    "Configura tu autenticación de dos factores"
                  )}
                </h3>
                <p className="text-sm text-gray-600">
                  {t(
                    "setup2FADescription",
                    "Para mayor seguridad, configura Google Authenticator antes de continuar."
                  )}
                </p>
              </div>

              {error2FA && (
                <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-800">
                  {error2FA}
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 rounded-lg border border-green-200 bg-green-50 text-sm text-green-800">
                  {success}
                </div>
              )}

              <div className="space-y-4">
                {/* Paso 1 */}
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {t(
                        "setup2FAStep1",
                        "Descarga Google Authenticator en tu móvil"
                      )}
                    </p>
                    <a
                      href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-700 mt-1 inline-block"
                    >
                      {t("downloadGoogleAuth", "Descargar para Android o iOS")}{" "}
                      →
                    </a>
                  </div>
                </div>

                {/* Paso 2 - QR Code */}
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {t(
                        "setup2FAStep2",
                        "Escanea este código QR con la aplicación"
                      )}
                    </p>
                  </div>

                  {qrCodeUrl && (
                    <div className="bg-white p-4 rounded-lg border-2 border-gray-300 flex justify-center">
                      <QRCode value={qrCodeUrl} size={200} />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowManualEntry(!showManualEntry)}
                    className="mt-3 text-xs text-gray-600 hover:text-gray-900 underline w-full text-center"
                  >
                    {t("cannotScanQR", "¿No puedes escanear el QR?")}
                  </button>

                  {showManualEntry && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-xs text-gray-700 mb-2">
                        {t(
                          "manualEntryInstructions",
                          "Introduce esta clave manualmente en Google Authenticator:"
                        )}
                      </p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                          {manualEntryKey}
                        </code>
                        <button
                          type="button"
                          onClick={copyToClipboard}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                        >
                          {t("copyKey", "Copiar")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Paso 3 - Verificar código */}
                <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {t(
                        "setup2FAStep3",
                        "Introduce el código de 6 dígitos que aparece"
                      )}
                    </p>
                  </div>

                  <form onSubmit={handle2FAVerification}>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      placeholder={t("verificationCodePlaceholder", "000000")}
                      value={twoFactorCode}
                      onChange={(e) =>
                        setTwoFactorCode(e.target.value.replace(/\D/g, ""))
                      }
                      className="w-full text-center text-2xl font-mono tracking-widest rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 mb-3"
                      autoFocus
                    />

                    <button
                      type="submit"
                      disabled={verifying2FA || twoFactorCode.length !== 6}
                      className={`w-full py-2.5 rounded-lg text-white font-semibold transition-colors ${
                        verifying2FA || twoFactorCode.length !== 6
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {verifying2FA ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="animate-spin h-5 w-5"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          {t("verifying2FA", "Verificando código...")}
                        </span>
                      ) : (
                        t("verifyAndContinue", "Verificar y continuar")
                      )}
                    </button>
                  </form>
                </div>

                <p className="text-xs text-center text-gray-500 mt-4">
                  {t(
                    "qrProblemsHelp",
                    "¿Problemas? Usa la app oficial o contacta a soporte."
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
