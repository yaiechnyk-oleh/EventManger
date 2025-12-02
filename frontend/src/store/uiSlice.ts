import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SortBy = 'dateAsc' | 'dateDesc' | 'titleAsc' | 'titleDesc';

interface UIState {
    sortBy: SortBy;
    categoryFilter?: string;
    dateFrom?: string;
    dateTo?: string;
}

const initialState: UIState = {
    sortBy: 'dateAsc',
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setSortBy(state, action: PayloadAction<SortBy>) {
            state.sortBy = action.payload;
        },
        setCategoryFilter(state, action: PayloadAction<string | undefined>) {
            state.categoryFilter = action.payload;
        },
        setDateFrom(state, action: PayloadAction<string | undefined>) {
            state.dateFrom = action.payload;
        },
        setDateTo(state, action: PayloadAction<string | undefined>) {
            state.dateTo = action.payload;
        },
        resetFilters(state) {
            state.sortBy = 'dateAsc';
            state.categoryFilter = undefined;
            state.dateFrom = undefined;
            state.dateTo = undefined;
        },
    },
});

export const { setSortBy, setCategoryFilter, setDateFrom, setDateTo, resetFilters } = uiSlice.actions;
export default uiSlice.reducer;
