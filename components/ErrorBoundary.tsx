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
 * Using a constructor is the standard and most robust way to initialize state,
 * ensuring that `this.state` and `this.props` are correctly set up from the base `React.Component`.
 */
// FIX: The ErrorBoundary class must extend React.Component to have access to component properties like `state`, `props`, and `setState`.
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // FIX: The getDerivedStateFromError method should return an object that can be merged into the state.
    // The existing error was due to `state` not being defined on the class instance, but the return value is also important.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReset() {
    // FIX: `setState` is a method on React.Component, which was missing.
    this.setState({ hasError: false, error: null });
    window.location.reload();
  }

  render(): ReactNode {
    // FIX: `this.state` was undefined because the class did not extend React.Component.
    if (this.state.hasError && this.state.error) {
      return (
        <ErrorFallback
          error={this.state.error}
          resetErrorBoundary={this.handleReset}
        />
      );
    }

    // FIX: `this.props` was undefined for the same reason.
    return this.props.children;
  }
}