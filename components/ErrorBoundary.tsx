import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './Button';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
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
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full text-center border-t-8 border-red-800">
            <div className="text-6xl mb-4">💥</div>
            <h1 className="text-2xl font-bold text-gray-800 font-western mb-2">Primary Buffer Panel Just Fell Off</h1>
            <p className="text-gray-600 mb-6">
              Something went wrong with the setup guide. It might be a gorram glitch in the Cortex.
            </p>
            <div className="bg-gray-100 p-3 rounded text-left text-xs text-red-700 font-mono mb-6 overflow-auto max-h-32">
              {this.state.error?.message}
            </div>
            <Button onClick={this.handleReset} fullWidth>
              Reboot System
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}