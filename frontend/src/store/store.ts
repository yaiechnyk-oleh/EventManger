import { configureStore } from '@reduxjs/toolkit';
import { eventApi } from './eventApi';
import uiReducer from './uiSlice';

export const store = configureStore({
    reducer: {
        [eventApi.reducerPath]: eventApi.reducer,
        ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(eventApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
