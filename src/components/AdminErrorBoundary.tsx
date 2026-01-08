import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class AdminErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        this.setState({ errorInfo });
    }

    private handleReload = () => {
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
                    <div className="bg-destructive/10 p-6 rounded-full mb-6">
                        <AlertCircle className="w-12 h-12 text-destructive" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
                    <p className="text-muted-foreground mb-6 max-w-md">
                        The admin panel encountered an unexpected error.
                    </p>

                    {this.state.error && (
                        <div className="bg-muted/50 p-4 rounded-lg mb-6 max-w-2xl w-full text-left overflow-auto max-h-60 border border-border">
                            <p className="font-mono text-sm text-destructive font-semibold mb-2">
                                {this.state.error.toString()}
                            </p>
                            {this.state.errorInfo && (
                                <pre className="font-mono text-xs text-muted-foreground">
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            )}
                        </div>
                    )}

                    <div className="flex gap-4">
                        <Button onClick={this.handleReload} className="gap-2">
                            <RefreshCw className="w-4 h-4" />
                            Reload Page
                        </Button>
                        <Button variant="outline" onClick={() => {
                            sessionStorage.clear();
                            window.location.href = '/';
                        }}>
                            Clear Session & Exit
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
