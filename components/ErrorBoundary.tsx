import React, { Component, ErrorInfo, ReactNode } from 'react';
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
 * Directly extending Component and using class fields for state helps resolve TypeScript resolution issues
 * that can occur with class-based components in some configurations.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Fix for Error on line 21: Property 'state' does not exist on type 'ErrorBoundary'.
  // Using a class field for state initialization ensures the property is recognized by the compiler on the instance.
  public state: ErrorBoundaryState = {
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
    // Fix for Error on line 37: Property 'setState' does not exist on type 'ErrorBoundary'.
    // setState is inherited from the base Component class.
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render(): ReactNode {
    // Fix for Error on line 43 & 46: Property 'state' does not exist on type 'ErrorBoundary'.
    // Accessing the 'state' property inherited from Component.
    if (this.state.hasError && this.state.error) {
      return (
        <ErrorFallback
          error={this.state.error}
          resetErrorBoundary={this.handleReset}
        />
      );
    }

    // Fix for Error on line 53: Property 'props' does not exist on type 'ErrorBoundary'.
    // Accessing the 'props' property inherited from Component.
    return this.props.children;
  }
}