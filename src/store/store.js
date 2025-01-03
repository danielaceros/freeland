import { configureStore } from '@reduxjs/toolkit';
import { userStore } from './userStore';
import { chatStore } from './chatStore';
import { minimizeMenuStore } from './minimizeMenuStore';

export const store = configureStore({
  reducer: {
    user: userStore.reducer,
    chat: chatStore.reducer,
    menuMinimize: minimizeMenuStore.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
