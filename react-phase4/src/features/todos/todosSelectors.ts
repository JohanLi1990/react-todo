import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { todosApi } from "./todosApi";

export const selectFilter = (s:RootState) => s.ui.filter;

// RTK Query selector for the cached query result
export const selectTodosResult = todosApi.endpoints.getTodos.select();

// Extract the actual array (default to empty)
export const selectTodosData = createSelector(
    selectTodosResult,
    (result) => result.data ?? []
);


export const selectVisibleTodos = createSelector(
    [selectTodosData, selectFilter],
    (todos, filter) => {
        if (filter === "all") return todos;
        if (filter === "active") return todos.filter((t) => !t.completed);
        return todos.filter((t) => t.completed);
    }
)

export const selectCounts = createSelector([selectTodosData], (todos) => {
    let completed = 0;
    for (const t of todos) if (t.completed) completed++;
    return {
        total: todos.length,
        completed,
        remaining: todos.length - completed
    };
});