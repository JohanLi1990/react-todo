import { configureStore} from "@reduxjs/toolkit";
import { todoApi } from "./todoApi";
import { uiReducer } from "./uiSlice";
import { prefsReducer } from "./prefsSlice";

export const store = configureStore({
    reducer: {
        ui: uiReducer,
        prefs: prefsReducer, // add
        [todoApi.reducerPath]: todoApi.reducer,
    },
    middleware: (getdefaultMiddleware) => getdefaultMiddleware().concat(todoApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;