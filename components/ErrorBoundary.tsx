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
// FIX: Changed to extend from `React.Component` directly. The previous approach of extending
// from a named `Component` import was causing type inference issues where inherited
// properties like `setState` and `props` were not being found on the class type.
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // FIX: Initializing state as a class field. The previous method of initializing
  // only in the constructor was causing TypeScript to fail to find inherited properties
  // like `state`, `setState` and `props` from React.Component. This change explicitly
  // defines `state` on the class, resolving the type errors.
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  // NOTE: This component was using a bound method in the constructor instead of
  // a class field arrow function. While the latter is more common, this pattern is
  // preserved as a comment in the original code indicated it was an intentional choice.
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

    // `this.props` is a standard part of a React class component.
    // The change to a class property for state should resolve the type inference issue
    // that caused this property to be reported as non-existent.
    return this.props.children;
  }
}
