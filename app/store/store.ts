import { configureStore } from '@reduxjs/toolkit';
import cvReducer from './cvSlice';
import sectionsReducer from './selectionsSlice';

export const store = configureStore({
  reducer: {
    cv: cvReducer,
    sections: sectionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
