

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
 */
// FIX: The `ErrorBoundary` class must extend `React.Component` to be a valid
// class component. This provides access to component lifecycle methods, state,
// and props, which resolves the errors on 'setState' and 'props'.
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Initialize state as a class property
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  // Use an arrow function to preserve `this` context for `setState`.
  handleReset = () => {
    // The error "Property 'setState' does not exist on type 'ErrorBoundary'" occurs
    // when the class does not extend React.Component. The fix is applied above.
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

    // The error "Property 'props' does not exist on type 'ErrorBoundary'" occurs
    // when the class does not extend React.Component. The fix is applied above.
    return this.props.children;
  }
}