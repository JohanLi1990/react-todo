import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type AppDispatch, increment } from "./store";

type CounterState = {
    value: number;
    lastUpdated: number | null;
};

const counterSlice = createSlice({
    
    name: "counter",
    initialState: {
        value : 0, 
        lastUpdated : null,
        meta: { source: "init"},
    } as CounterState & { meta: {source: string}},
    reducers : {
        increment(state) {
            state.value += 1;
        },

        add(state, action: PayloadAction<number>) {
            state.value += action.payload;
        },

        touch(state) {
            state.lastUpdated = Date.now();
        },

        incrementManual(state) {
            return {
                ...state, 
                value: state.value + 1
            }
        },

        asyncIncrement(state) {
            setTimeout(() => {
                state.value += 1; // Reducers don’t “own time”. Redux only knows what happens during dispatch.
            }, 1000);
        }
    }

});

const store = configureStore({
    reducer: {
        counter: counterSlice.reducer,
    },
});



let prevState = store.getState();
store.subscribe(() => {
    const nextState = store.getState();
    console.log("counter same?", prevState.counter === nextState.counter);
    console.log("meta same?", prevState.counter.meta === nextState.counter.meta);
    prevState = nextState;
});

store.subscribe(() => {
    console.log("state:", store.getState());
})

console.log("initial:", store.getState());

// store.dispatch(counterSlice.actions.increment());
// store.dispatch(counterSlice.actions.add(5));
// store.dispatch(counterSlice.actions.increment());
// store.dispatch(counterSlice.actions.touch());
// store.dispatch(counterSlice.actions.increment());
// store.dispatch(counterSlice.actions.touch());

// Immer
// store.dispatch(counterSlice.actions.increment());
// store.dispatch(counterSlice.actions.incrementManual());
store.dispatch(asyncIncrement);

