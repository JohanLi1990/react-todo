

type QueryStateProps = {
    isLoading: boolean,
    isError: boolean;
    error?: string;
    isEmpty?: boolean;
    onRetry?: () => void;
    children: React.ReactNode;
}

export function QueryState({
    isLoading,
    isError, 
    error, 
    isEmpty,
    onRetry,
    children,
}: QueryStateProps) {
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return (
            <div style={{color: "red"}} >
                <div>Something went wrong...</div>
                {error && <pre>{String(error)}</pre>}
                {onRetry && <button onClick={onRetry}>Retry</button>}
            </div>
        )
    }

    if (isEmpty) {
        return <div>No data.</div>
    }

    return <>{children}</>
}
