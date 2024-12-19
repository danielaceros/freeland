import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: {}
};

/* eslint-disable no-param-reassign */
export const chatStore = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    openChat: (state, action) => {
      const newData = action.payload;
      return {...state, data:newData}
    },
  },
});
/* eslint-enable no-param-reassign */

export const { openChat } = chatStore.actions;

// export default userStore.reducer;
