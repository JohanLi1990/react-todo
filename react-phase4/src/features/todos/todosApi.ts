import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export type Todo = {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
}

export const todosApi = createApi({
    reducerPath: "todosApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://jsonplaceholder1.typicode.com/",
    }),
    tagTypes: ["Todos"],
    endpoints: (builder) => ({
        getTodos: builder.query<Todo[], void>({
            query: () => "todos?_limit=10",
            providesTags: ["Todos"],
        }),

        toggleTodo: builder.mutation<Todo, {userId:number;id: number; completed: boolean}>({
            query: ({userId, id, completed}) => ({
                url: `todos/${userId}`,
                method: "PATCH",
                body: { 
                    "id": id,
                    "completed": completed
                },
            }),

            // Optimistic Update
            async onQueryStarted({ id, completed }, { dispatch, queryFulfilled}) {
                // pathc the cached getTodos result immediately
                const patchResult = dispatch(
                    todosApi.util.updateQueryData("getTodos", undefined, (draft) => {
                        const todo = draft.find((t) => t.id === id);
                        if (todo) todo.completed = completed
                    })
                );

                try {
                    await queryFulfilled; // wait for server
                } catch {
                    patchResult.undo();
                }
            },
            
            // For JSONPlaceholder, PATCH “succeeds” but doesn’t actually persist.
            // We’ll disable invalidation to see optimistic behavior clearly.
            invalidatesTags: [],
        })
    })
})

export const { useGetTodosQuery, useToggleTodoMutation } = todosApi;