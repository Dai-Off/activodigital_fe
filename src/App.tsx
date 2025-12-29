import { BrowserRouter as Router } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import ToastContainer from "./components/ui/Toast";
import ScrollToTop from "./components/ScrollToTop";

// Página de lista de secciones (opcional)
import { useTranslation } from "react-i18next";
import { AppRouter } from "./Router/router";

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = (i18n.language || "es").split("-")[0];
  }, [i18n.language]);

  return (
    <ToastProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <ScrollToTop />
            <AppRouter />
            <ToastContainer />
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
