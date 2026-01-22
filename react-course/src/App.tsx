import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  // console.log("App render");
  // throw new Error("boom")

  // local var
  let local = 0;
  const [count, setCount] = useState(0);

  // useEffect(() => {
  //   const id = setTimeout(() => {
  //     console.log("Effect sees count:", count);
  //   }, 1000);
  //   return () => clearTimeout(id);
  // }, [count]);

  const handler = () => {
    setCount(c => c + 1);
    setTimeout(() => {
      setCount(c => c + 1);
    }, 1000);
  };

  useEffect(() => {
    console.log("connecting...");
    const id = setInterval(() => {
      console.log("tick");
    }, 1000);
    return () =>{
      console.log("disconnecting...");
      clearInterval(id);
    };
  }, [count]);

  // console.log("render", {local, count});
  const updateLocal = () => {
    local++;
    setCount(c => c + 1);
    setCount(c => c + 1);
    console.log("click", {local, count});
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <h2>{"Remaining:" + count}</h2>
      <div className="card">
        {/* <button onClick={logLater}>log logLater</button> */}
        <button onClick={handler}>+</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <button onClick={updateLocal}>Click</button>
    </>
  )
}

export default App
