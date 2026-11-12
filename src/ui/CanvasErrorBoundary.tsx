import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class CanvasErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('CanvasErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: '#020617',
            color: '#f8fafc',
            fontFamily: 'system-ui, sans-serif',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          <h1 style={{ color: '#38bdf8', fontSize: '1.75rem', marginBottom: '12px' }}>
            3D Graphics Environment Encountered an Issue
          </h1>
          <p style={{ color: '#94a3b8', maxWidth: '520px', lineHeight: 1.6, marginBottom: '20px' }}>
            {this.state.error?.message ||
              'A rendering or WebGL context error occurred while rendering the 3D pipeline.'}
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#1e293b',
                color: '#38bdf8',
                border: '1px solid #38bdf8',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Reload Scene
            </button>
            <a
              href="/resume/"
              style={{
                background: '#0284c7',
                color: '#ffffff',
                padding: '10px 20px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 700,
              }}
            >
              Continue to 2D Resume
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

