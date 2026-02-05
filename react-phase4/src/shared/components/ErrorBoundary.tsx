import React from "react";


type State = { hasError: boolean};

/**
 * A bit more detail:

React’s built‑in error boundary mechanism is class‑only.
The two hooks that make an error boundary work are:
static getDerivedStateFromError
componentDidCatch
Function components can’t implement those, so they can’t catch render errors in their children.
 * 
 */

export class ErrorBoundary extends React.Component<{children: React.ReactNode}, State> {
    state: State = {hasError: false};

    static getDerivedStateFromError() {
        return {hasError: true};
    }

    componentDidCatch(error: Error): void {
        console.error("Render error: ", error);
    }

    render() {
        if (this.state.hasError) {
            return <div>Something went wrong rendering this page.</div>
        }

        return this.props.children;
    }
}