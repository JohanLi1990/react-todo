import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type UiState = {
    filter: "all" | "active" | "completed";
}

const initialState: UiState = {
    filter: "all",
}

const uiSlice = createSlice({
    name: "UI",
    initialState,
    reducers: {
        setFilter(state, action: PayloadAction<UiState["filter"]>) {
            state.filter = action.payload;
        },
    },
});

export const {setFilter} = uiSlice.actions;
export default uiSlice.reducer;