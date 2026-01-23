import React from "react";

// prop setCount changes, also will lead to Child re-render
export const Child = React.memo(function Child( { onClick, config }: { onClick: () => void; config?: any }) {
    console.log("Child render", config.step);
    return (
        <>  
            <h2>Child</h2>
            <button onClick={onClick}>PLUS</button>
    
        </>
    );
});