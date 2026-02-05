import { useCallback, useState } from "react";

type Todo = {
    id: string;
    text: string;
    done: boolean;
};

type TodoItemProps = {
    todo: Todo;
    onToggle: (id: string) => void;
};

function TodoItem({todo, onToggle}: TodoItemProps) {
    return (
        <li>
            <input 
                type="checkbox"
                checked={todo.done}
                onChange={() => onToggle(todo.id)}
            />
            {todo.text}
        </li>

    );
}


function TodoList() {
    const[todos, setTodos] = useState<Todo[]>([]);

    const toggleTodo = useCallback((id: string) => {
        setTodos(ts => 
            ts.map(t =>
                t.id == id ? {...t, done: !t.done} : t
            )
        );
    }, []);

    return (
        <ul>
            {
                todos.map(t => (
                    <TodoItem
                    key = {t.id}
                    todo = {t}
                    onToggle={toggleTodo}
                    />
                ))
            }

        </ul>
    );
}

