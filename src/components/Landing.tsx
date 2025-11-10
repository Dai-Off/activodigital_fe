import { lazy, Suspense, useEffect } from "react";
import { LandingHeader as Header } from "./LandingHeader";
import { LandingHero as Hero } from "./LandingHero";
import { LandingFooter as Footer } from "./LandingFooter";
// import { LandingCookieBanner as CookieBanner } from "./LandingCookieBanner";
import { useTranslation } from "react-i18next";

// Lazy load sections
const FeaturesSection = lazy(() => import("./LandingFeatures").then(module => ({ default: module.LandingFeatures })));
const HowItWorksSection = lazy(() => import("./LandingHowItWorks").then(module => ({ default: module.LandingHowItWorks })));
const ComplianceSection = lazy(() => import("./LandingCompliance").then(module => ({ default: module.LandingCompliance })));
const SecuritySection = lazy(() => import("./LandingSecurity").then(module => ({ default: module.LandingSecurity })));
const ChatSection = lazy(() => import("./LandingChat").then(module => ({ default: module.LandingChat })));

const SectionSkeleton = () => (
  <div className="px-4 md:px-6 py-12 md:py-20">
    <div className="max-w-6xl mx-auto">
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg w-2/3 mx-auto" />
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg w-1/2 mx-auto" style={{ animationDelay: '0.1s' }} />
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <div className="h-64 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-2xl" style={{ animationDelay: '0.2s' }} />
          <div className="h-64 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-2xl" style={{ animationDelay: '0.3s' }} />
            </div>
          </div>
        </div>
      </div>
  );

export default function Landing() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const baseLang = (i18n.language || 'es').split('-')[0];
    const seoTitle =
      baseLang === 'en'
        ? 'ARKIA - Global Real Estate Asset Management'
        : 'ARKIA - Gestión Global de Activos Inmobiliarios';

    document.title = seoTitle;
    document.documentElement.lang = baseLang;
    localStorage.setItem('arkia-language', baseLang.toUpperCase());
  }, [i18n.language]);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: '#FFFFFF' }}>
      <Header />
      <main role="main" aria-label="Contenido principal">
        <Hero />
        <Suspense fallback={<SectionSkeleton />}>
          <FeaturesSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <HowItWorksSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <SecuritySection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <ChatSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <ComplianceSection />
        </Suspense>
      </main>
      <Footer />
      {/* <CookieBanner /> */}
    </div>
  );
}
