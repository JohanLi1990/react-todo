import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { QueryState } from "../../shared/components/QueryState";
import { setFilter } from "../ui/uiSlice";
import { useGetTodosQuery, useToggleTodoMutation } from "./todosApi";
import { selectCounts, selectVisibleTodos } from "./todosSelectors";

export function TodosPage() {
    const dispatch = useAppDispatch();
    const filter = useAppSelector((s) => s.ui.filter);
    const todos = useAppSelector(selectVisibleTodos);
    const counts = useAppSelector(selectCounts);

    const {isLoading, isFetching, isError, refetch} = useGetTodosQuery();
    const [toggleTodo] = useToggleTodoMutation();

    // timer boom!
    // if (Math.random() > 0.9) {
    //     throw new Error("boom");
    // }

    return (
        <div style={{display: "grid", gap: 12}}>
            <h1>Phase 4 - Todos</h1>
            <div>loading: {String(isLoading)} / fetching: {String(isFetching)}</div>
            <div style={{display: "flex", gap: 8}}>
                <button onClick={() => dispatch(setFilter("all"))}>all</button>
                <button onClick={() => dispatch(setFilter("active"))}>active</button>
                <button onClick={() => dispatch(setFilter("completed"))}>completed</button>
                <button onClick={() => refetch()}>Refetch</button>
            </div>

            <div>filter: {filter}</div>
            <div>
                total: {counts.total} / completed: {counts.completed} / remaining:{" "}
                {counts.remaining}
            </div>
            <QueryState
                isLoading={isLoading}
                isError={isError}
                isEmpty={todos.length === 0}
                onRetry={refetch}
            >
                  <ul>
                    {
                        todos.map((t) => (
                            <li key={t.id}>
                                <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                    <input 
                                    type="checkbox" 
                                    checked={t.completed} 
                                    onChange={() => 
                                        toggleTodo({ userId: t.userId, id: t.id, completed: !t.completed})
                                    }
                                    />
                                    {t.title}
                                </label>
                            </li>
                        ))
                    }
                </ul>
            </QueryState>

          
        </div>
    );

}