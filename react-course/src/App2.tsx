import { useDispatch, useSelector } from "react-redux";
import { asyncIncrement, increment, setSource, tick } from "./stores/store";
import type { RootState, AppDispatch } from "./stores/store";
import { useGetTodosQuery } from "./todoApi";


function ValueViewer() {
  const value = useSelector((s: RootState) => s.counter.value);
  console.log("ValueViewer render");
  return <div>value: {value}</div>
}


function MetaViewer() {
  const meta = useSelector((s: RootState) => s.counter.meta);
  console.log("MetaViewer render");
  return <div>source: {meta.source}</div>
}

function BadCombinedViewer() {
  const value = useSelector((s: RootState) => s.counter.value);
  const source = useSelector((s: RootState) => s.counter.meta.source);

  // BAD Approach, every tick will result in new `combined`
  // const combined = useSelector((s: RootState) => ({
  //   value: s.counter.value,
  //   source: s.counter.meta.source,
  // }));

  console.log("BadCombinedViewer render");
  return (
    <div>
      {/* combined: {combined.value} / {combined.source} */}
      combined: {value} / {source}
    </div>
  );
}

function TodoList() {
  const {data, isLoading} = useGetTodosQuery();
  if (isLoading) return <div>loading...</div>;

  return (
    <ul>
      {data!.map(t => (
        <li key={t.id}>{t.text}</li>
      ))}
    </ul>
  );
}

export default function App2() {
  const dispatch = useDispatch<AppDispatch>();
  console.log("App render");

  return (
    <div style={{display: "grid", gap: 8}}>
      <button onClick={() => dispatch(increment())}>increment</button>
      <button onClick={() => dispatch(asyncIncrement())}>Async increment</button>
      <button onClick={() => dispatch(setSource("X"))}>set Source</button>
      <button onClick={() => dispatch(tick())}>tick</button>

      <ValueViewer />
      <MetaViewer />
      <BadCombinedViewer />
      <TodoList />
    </div>
  )
}