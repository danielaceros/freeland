import { configureStore } from '@reduxjs/toolkit';
import { userStore } from './userStore';

export const store = configureStore({
  reducer: {
    user: userStore.reducer,
  },
});

export default store;
