import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "../features/ui/uiSlice"
import { todosApi } from "../features/todos/todosApi";

export const store = configureStore({
    reducer: {
        ui: uiReducer,
        [todosApi.reducerPath]: todosApi.reducer,
    },
    middleware: (getDefault) => getDefault().concat(todosApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;