import React, { ErrorInfo, ReactNode } from 'react';
import { ErrorFallback } from './ErrorFallback';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary class component to catch rendering errors in its children.
 * Directly extending React.Component and using class fields for state helps resolve TypeScript resolution issues
 * that can occur with class-based components in some configurations.
 */
// FIX: The ErrorBoundary class must extend React.Component to have access to component lifecycle methods and properties like `this.setState` and `this.props`.
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Initialize state as a class field.
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      return (
        <ErrorFallback
          error={this.state.error}
          resetErrorBoundary={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}
