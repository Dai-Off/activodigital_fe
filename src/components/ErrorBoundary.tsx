import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { SupportContactModal } from './SupportContactModal';

interface ErrorBoundaryFallbackProps {
  error?: Error;
  onRetry: () => void;
}

const ErrorBoundaryFallback: React.FC<ErrorBoundaryFallbackProps> = ({ error, onRetry }) => {
  const { t } = useTranslation();
  const [isSupportModalOpen, setIsSupportModalOpen] = React.useState(false);

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <svg className="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-lg font-semibold text-gray-900">{t('errorBoundary.title')}</h2>
          </div>
          
          <p className="text-gray-600 mb-4">
            {t('errorBoundary.message')}
          </p>
          
          {error && (
            <details className="mb-4">
              <summary className="text-sm text-gray-500 cursor-pointer">
                {t('errorBoundary.technicalDetails')}
              </summary>
              <pre className="mt-2 text-xs text-gray-400 bg-gray-50 p-2 rounded overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
          
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {t('errorBoundary.reloadPage')}
              </button>
              <button
                onClick={onRetry}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                {t('errorBoundary.retry')}
              </button>
            </div>
            <button
              onClick={() => setIsSupportModalOpen(true)}
              className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {t('errorBoundary.contactSupport', 'Contactar con soporte')}
            </button>
          </div>
        </div>
      </div>

      <SupportContactModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        initialCategory="bug"
        initialSubject={t('errorBoundary.supportSubject', 'Error en la aplicación')}
        initialMessage={error ? `Error: ${error.message}\n\n${error.stack || ''}` : ''}
        context={`Error Boundary - ${window.location.href}`}
      />
    </>
  );
};

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorBoundaryFallback error={this.state.error} onRetry={() => this.setState({ hasError: false, error: undefined })} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
