import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type Todo = {
    id: string;
    text: string;
    done: boolean;
}

export const todoApi = createApi({
    reducerPath: "todoApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:3000", // Mockoon base URL
    }),
    tagTypes: ["Todos"],
    endpoints: (builder) => ({
        getTodos: builder.query<Todo[], void>({
            query: () => "/todos",
            providesTags: ["Todos"],
        }),

        addTodo: builder.mutation<Todo, Pick<Todo, "text">>({
            query: (body) => ({
                url: "/todos",
                method: "POST",
                body,
            }), 
        
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                // 1) Optimistically add a temp item to the cached GET /todos result
                const tempId = "temp-" + Math.random().toString(16).slice(2);
                const patch = dispatch(
                    todoApi.util.updateQueryData("getTodos", undefined, (draft) => {
                        draft.unshift({ id: tempId, text: arg.text, done: false });
                    })
                );

                try {
                    // 2) Wait for the real server response
                    const { data: created } = await queryFulfilled;

                    // 3) Replace temp item with real item from server
                    dispatch(
                        todoApi.util.updateQueryData("getTodos", undefined, (draft) => {
                        const idx = draft.findIndex((t) => t.id === tempId);
                        if (idx !== -1) draft[idx] = created;
                        })
                    );
                } catch {
                // 4) If POST failed, roll back optimistic update
                    patch.undo();
                }
            },

      // You can keep invalidation or remove it.
      // Keeping it is fine; with a dumb mock it will refetch back to 2 anyway.
      // I'd remove it for now to avoid "snap back".
      // invalidatesTags: ["Todos"],
        }),

        toggleTodo: builder.mutation<Todo, {id:string; done: boolean}>({
            query: ({id, done}) => ({
                url: "/todos/${id}",
                method: "PATCH",
                body: { done }
            }),

            async onQueryStarted({id, done}, {dispatch, queryFulfilled}) {
                // 1) Optimistically update cache
                const patchResult = dispatch(
                    todoApi.util.updateQueryData("getTodos", undefined, (draft)=> {
                        const todo = draft.find((t) => t.id === id);
                        if (todo) {
                            todo.done = done;
                        }
                    })
                );

                try {
                    // 2) wait for server confirmation
                    await queryFulfilled;
                } catch {
                    // 3) Rollback on failure
                    patchResult.undo();
                }
            }
        })
    }) 
});

export const { useGetTodosQuery, useAddTodoMutation, useToggleTodoMutation } = todoApi;