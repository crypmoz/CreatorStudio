import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Can add error reporting service here
    // reportError(error, errorInfo);
  }

  resetErrorBoundary = (): void => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center bg-gray-50 rounded-lg shadow-sm m-4">
          <div className="mb-6 text-red-500">
            <AlertTriangle size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-6 max-w-md">
            We're sorry, but we encountered an error while rendering this part of the application.
          </p>
          
          {process.env.NODE_ENV !== 'production' && this.state.error && (
            <div className="mb-6 w-full max-w-xl">
              <details className="text-left">
                <summary className="text-sm font-medium text-gray-700 cursor-pointer mb-2">
                  Error Details (Developer Information)
                </summary>
                <div className="bg-gray-900 text-white p-4 rounded-md overflow-auto max-h-[300px] text-xs">
                  <p className="font-bold mb-2">{this.state.error.toString()}</p>
                  <pre>{this.state.errorInfo?.componentStack}</pre>
                </div>
              </details>
            </div>
          )}
          
          <div className="space-x-4">
            <Button 
              onClick={this.resetErrorBoundary}
              variant="outline"
              className="space-x-2"
            >
              <RefreshCw size={16} />
              <span>Try Again</span>
            </Button>
            
            <Button 
              onClick={() => window.location.href = '/'}
              variant="default"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;