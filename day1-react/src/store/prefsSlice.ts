import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";


export type SortMode = "created" | "alpha";

export type PrefsState = {
    sortMode:SortMode;
    hideLogo: boolean;
    denseMode: boolean;
};

const initialState: PrefsState = {
    sortMode: "created",
    hideLogo: false,
    denseMode: false
};

const prefsSlice = createSlice({
    name: "prefs",
    initialState,
    reducers: {
        setSortMode(state, action: PayloadAction<SortMode>) {
            state.sortMode = action.payload;
        },

        toggleHideLogo(state) {
            state.hideLogo = !state.hideLogo;
        },

        toggleDenseMode(state) {
            state.denseMode = !state.denseMode;
        }
    }
});

export const {setSortMode, toggleDenseMode, toggleHideLogo} = prefsSlice.actions;
export const prefsReducer = prefsSlice.reducer;

// selectors
export const selectSortMode = (state: RootState) => state.prefs.sortMode;
export const selectHideLogo = (state: RootState) => state.prefs.hideLogo;
export const selectDenseMode = (state: RootState) => state.prefs.denseMode;