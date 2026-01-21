import { useState, useEffect } from 'react'
import './App.css'
import ReactLogo from './assets/react.svg'
import { useAddTodoMutation, useGetTodosQuery, useToggleTodoMutation } from './store/todoApi';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { selectFilterText, selectShowCompleted, setFilterText, toggleShowCompleted } from './store/uiSlice';
import { selectDenseMode, selectHideLogo, selectSortMode, setSortMode, toggleDenseMode, toggleHideLogo } from './store/prefsSlice';

function App() {
  console.log("App rendered");

  const dispatch = useAppDispatch();
  const filterText = useAppSelector(selectFilterText);
  const showCompleted = useAppSelector(selectShowCompleted);

  const sortMode = useAppSelector(selectSortMode);
  const hideLogo = useAppSelector(selectHideLogo);
  const denseMode = useAppSelector(selectDenseMode);

  const [text, setText] = useState("");
  const { data: todos = [], isLoading, isFetching, error, refetch } = useGetTodosQuery();
  const [addTodo, {isLoading: isAdding, error: addError}] = useAddTodoMutation();
  const [toggleTodo] = useToggleTodoMutation();

  const filteredTodos = todos.filter((t) => {
    if (!showCompleted && t.done) return false;
    if (filterText.trim() && !t.text.toLowerCase().includes(filterText.trim().toLowerCase())) return false;
    return true;
  });

  const visibleTodos = [...filteredTodos].sort((a, b) => {
    if (sortMode === "alpha") return a.text.localeCompare(b.text);
    return 0;
  });

  const remaining = todos.filter((t) => !t.done).length;

  useEffect(() => {
    document.title = `TODOs: ${remaining} left`;
  }, [remaining]);

  async function handleAdd() {
    const trimmed = text.trim();
    if (!trimmed) return;
    try {
      await addTodo({text: trimmed}).unwrap(); // unwrap -> throws on error
      setText("");
      // no  manual refetch needed because invalidatesTags triggers it
    } catch (e) {
      console.error("Add todo failed", e);
    }
  }

  if (isLoading) {
    return <div style={{maxWidth: 640, margin: "40px auto"}}>Loading...</div>;
  }

  if (error) {
    return (
      <div style={{ maxWidth: 640, margin: "40px auto"}}>
        <h2>Failed to load</h2>
        <button onClick={refetch}>Retry</button>
      </div>
    );
  }

  return (
  
  <div style={{ maxWidth: 640, margin: "40px auto", fontFamily: "system-ui" }}>
    {
      !hideLogo ? (
        <img src={ReactLogo} alt="React" style={{ width: 56, height: 'auto', display: 'block', margin: '0 auto 16px' }}/>
      ) : null
    }

    <h1>Day 3 — RTK Query Todos</h1>
    
    <p>
      Remaining: <b>{remaining}</b> 
      {isFetching ? <span style={{ marginLeft : 8}}>(refreshing...)</span> : null}
    </p>

    <div style={{ display: "flex", gap: 12, alignItems: "center", margin: "12px 0" }}>
      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="checkbox"
          checked={hideLogo}
          onChange={() => dispatch(toggleHideLogo())}
        />
        Hide logo
      </label>

      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="checkbox"
          checked={denseMode}
          onChange={() => dispatch(toggleDenseMode())}
        />
        Dense mode
      </label>

      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        Sort:
        <select
          value={sortMode}
          onChange={(e) => dispatch(setSortMode(e.target.value as "created" | "alpha"))}
          style={{ padding: 6 }}
        >
          <option value="created">Created</option>
          <option value="alpha">Alphabetical</option>
        </select>
      </label>
    </div>


    <div style={{ display: "flex", gap: 12, alignItems: "center", margin: "12px 0" }}>
      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="checkbox"
          checked={showCompleted}
          onChange={() => dispatch(toggleShowCompleted())}
        />
        Show completed
      </label>

      <input
        value={filterText}
        onChange={(e) => dispatch(setFilterText(e.target.value))}
        placeholder="Filter todos..."
        style={{ flex: 1, padding: 8 }}
      />
    </div>


    <div style={{ display: "flex", gap: 8 }}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a todo..."
        style={{ flex: 1, padding: 8 }}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleAdd();
        }}
      />
      <button onClick={handleAdd} style={{ padding: "8px 12px" }}>
        Add
      </button>
      <button onClick={refetch} style={{ padding: "8px 12px" }}>
        Refetch
      </button>
    </div>
      
    {addError ? <div style={{marginTop: 8}}>Add failed (check Mockoon)</div> : null }

    <ul style={{ padding: 0, listStyle: "none", marginTop: 16 }}>
      {visibleTodos.map((t) => (
        <li
          key={t.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: denseMode ? "6px 0": "10px 0",
            borderBottom: "1px solid #eee",
          }}
        >
          <input type="checkbox" checked={t.done} onChange={() => toggleTodo({id:t.id, done: !t.done})} />
          <span style={{ flex: 1, textDecoration: t.done ? "line-through" : "none" }}>
            {t.text}
          </span>
          <button disabled>Delete</button>
        </li>
      ))}
    </ul>
  </div>
  );
}

export default App
