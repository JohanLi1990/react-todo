import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { act } from "react";
import type { RootState } from "./store";
import type { Root } from "react-dom/client";


export type UIState={
    showCompleted: boolean;
    filterText: string;
    editingTodoId: string | null;
}

const initialState: UIState = {
    showCompleted:true,
    filterText: "",
    editingTodoId: null,
}

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        toggleShowCompleted(state) {
            state.showCompleted = !state.showCompleted;
        },

        setShowCompleted(state, action: PayloadAction<boolean>) {
            state.showCompleted = action.payload;
        },

        setFilterText(state, action: PayloadAction<string>) {
            state.filterText = action.payload;
        },

        startEditing(state, action: PayloadAction<string>) {
            state.editingTodoId = action.payload;
        },

        stopEditing(state) {
            state.editingTodoId = null;
        }
    }
});

export const {
    toggleShowCompleted,
    setShowCompleted,
    setFilterText,
    startEditing,
    stopEditing,
} = uiSlice.actions;

export const uiReducer = uiSlice.reducer;
// --- selectors ---
// These expect your store to mount this reducer at state.ui
export const selectShowCompleted = (state: RootState) => state.ui.showCompleted;
export const selectFilterText = (state: RootState) => state.ui.filterText;
export const selectEditingTodoId = (state: RootState) => state.ui.editingTodoId;
