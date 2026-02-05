import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { todoApi } from "../todoApi";


type CounterState = {
    value: number;
    meta: {source: string};
};

const counterSlice = createSlice({
    name: "counter",
    initialState: { value: 0, meta: {source: "init"}} as CounterState,
    reducers: {
        increment(state) {
            state.value += 1;
        },

        setSource(state, action: PayloadAction<string>){
            state.meta.source = action.payload;
        },

        asyncIncrement(state) {
            setTimeout(() => {
                state.value += 1; // Reducers don’t “own time”. Redux only knows what happens during dispatch.
            }, 1000);
        }

    },
});

const tickSlice = createSlice({
    name: "tick",
    initialState: { n : 0},
    reducers: {
        tick(state) {
            state.n += 1;
        },
    },
});

export const { tick } = tickSlice.actions;

export const { increment, setSource, asyncIncrement} = counterSlice.actions;
// export const asyncIncrement = () => {
//     return async (dispatch: AppDispatch) => {
//         await new Promise(res => setTimeout(res, 1000));
//         dispatch(increment());
//     }
// }

export const store = configureStore({
    reducer: { 
        counter : counterSlice.reducer, 
        tick: tickSlice.reducer,
        [todoApi.reducerPath]: todoApi.reducer,
    },

    middleware: getDefault => getDefault().concat(todoApi.middleware),
    
});

store.subscribe(() => {
    console.log("state:", store.getState());
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// store.dispatch(asyncIncrement());

