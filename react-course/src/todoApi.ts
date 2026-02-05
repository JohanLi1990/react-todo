import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type Todo = {
    id: number;
    text:string;
    done: boolean;
}

export const todoApi = createApi({
    reducerPath: "todoApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:3000",
    }),
    endpoints: builder =>({
        getTodos: builder.query<Todo[], void>({
            query: () => "todos?_limit=5",
        }),
    }),
});

export const { useGetTodosQuery } = todoApi;