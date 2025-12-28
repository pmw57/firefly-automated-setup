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
// FIX: The `ErrorBoundary` class must extend `React.Component` to be a valid class component. This provides access to `this.props` and `this.setState`, resolving the errors.
// FIX: Extended React.Component to make this a valid React class component, providing access to component lifecycle methods and properties like state and props.
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
    // FIX: Add this. to setState and ensure class extends React.Component
    // FIX: Correctly call `this.setState` which is inherited from React.Component.
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

    // FIX: Add this. to props and ensure class extends React.Component
    // FIX: Correctly access `this.props` to render child components.
    return this.props.children;
  }
}