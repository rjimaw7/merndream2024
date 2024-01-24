import { configureStore } from "@reduxjs/toolkit";
import dreamsReducer from "../features/dreams/dreamSlice";

const store = configureStore({
  reducer: {
    dreams: dreamsReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
