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
// FIX: All reported errors stem from this class not extending React.Component. By extending it, the component gains access to `this.props`, `this.state`, and `this.setState`, resolving the errors.
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
    // The getDerivedStateFromError method should return an object that can be merged into the state.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReset() {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  }

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
