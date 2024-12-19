import { configureStore } from '@reduxjs/toolkit';
import { userStore } from './userStore';
import { chatStore } from './chatStore';

export const store = configureStore({
  reducer: {
    user: userStore.reducer,
    chat: chatStore.reducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
