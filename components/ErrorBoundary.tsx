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
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // FIX: State initialization is moved into the constructor. The previous use of a class property
  // was causing TypeScript to fail to infer the inherited `setState` and `props`
  // members from React.Component. This more traditional pattern resolves the issue.
  state: ErrorBoundaryState;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
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
