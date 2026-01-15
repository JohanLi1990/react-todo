import { useState, useMemo, useEffect } from 'react'
import './App.css'

type Todo = {
  id:string;
  text:string;
  done:boolean;
}

function newID() {
  return Math.random().toString(16).slice(2);
}

function App() {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState<Todo[]>([
    {id: newID(), text:"Install Vite + React", done:true},
    {id: newID(), text:"Build a tiny app (no Redux)", done:false},
  ]);

  const [loading, setLoading] = useState(false);
  
  const remaining = useMemo(
    () => todos.filter((t) => !t.done).length,
    [todos]
  );

  useEffect(() => {
    document.title = `TODOs: ${remaining} left`;
  }, [remaining]);

  function addTodo() {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos((prev) => [{id:newID(), text:trimmed, done:false}, ...prev]);
    setText("");
  }

  async function handleLoad() {
    setLoading(true);
    try {
      const res = await fakeFetchTodos();
      setTodos((prev) => [...res, ...prev])
    } finally {
      setLoading(false);
    }


  }

  function toggle(id: string) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? {...t, done: !t.done} : t)) 
    );
  }

  function remove(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  function fakeFetchTodos(): Promise<Todo[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: newID(), text: "Fetched todo A", done: false },
          { id: newID(), text: "Fetched todo B", done: true },
        ]);
      }, 600);
    });
  }

  return (<div style={{ maxWidth: 640, margin: "40px auto", fontFamily: "system-ui" }}>
      <h1>Day 1 — Tiny React Todo</h1>

      <p>
        Remaining: <b>{remaining}</b>
      </p>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a todo..."
          style={{ flex: 1, padding: 8 }}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTodo();
          }}
        />
        <button onClick={addTodo} style={{ padding: "8px 12px" }}>
          Add
        </button>
        <button onClick={handleLoad} style={{ padding: "8px 12px" }} disabled={loading}>
          {loading ? "Loading..." : "Load"}
        </button>
      </div>

      <ul style={{ padding: 0, listStyle: "none", marginTop: 16 }}>
        {todos.map((t) => (
          <li
            key={t.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
            <span style={{ flex: 1, textDecoration: t.done ? "line-through" : "none" }}>
              {t.text}
            </span>
            <button onClick={() => remove(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App
