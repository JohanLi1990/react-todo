import { useCallback, useMemo, useState } from "react";
import { Child } from "./Child";


function Day5() {
    const [count, setCount] = useState(0);
    console.log("Parent render", count);

    const onClick = useCallback(() => {
        setCount(c => c + 1);
    }, []);

    const config = useMemo(() => ({step: 1}), []);

    return(
        <>
            <Child onClick={onClick} config={config}/>
        </>

    );
}

export default Day5;