import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="container py-5">
          <div className="alert alert-danger">
            <h4 className="alert-heading">
              <i className="bi bi-exclamation-triangle me-2"></i>
              Something went wrong
            </h4>
            <p>An unexpected error occurred. Please try refreshing the page.</p>

            {import.meta.env.DEV && this.state.error && (
              <div className="mt-3">
                <h6>Error details:</h6>
                <pre className="text-danger small">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}

            <hr />
            <div className="mb-0">
              <button
                className="btn btn-primary me-2"
                onClick={() => window.location.reload()}
              >
                <i className="bi bi-arrow-clockwise me-1"></i>
                Refresh Page
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={() => window.history.back()}
              >
                <i className="bi bi-arrow-left me-1"></i>
                Go Back
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;