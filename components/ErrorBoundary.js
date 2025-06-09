// components/ErrorBoundary.js
import { Component } from 'react';

class ErrorBoundary extends Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 text-center">
                    <h2>Something went wrong</h2>
                    <button onClick={() => window.location.reload()}>Refresh Page</button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;