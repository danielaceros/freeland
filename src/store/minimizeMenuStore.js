import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isMenuMinimize: false,
};

/* eslint-disable no-param-reassign */
export const minimizeMenuStore = createSlice({
  name: 'menuMinimize',
  initialState,
  reducers: {
    changeStateMinimize: (state, action) => {
      state.isMenuMinimize = action.payload;
    },
  },
});
/* eslint-enable no-param-reassign */

export const { changeStateMinimize } = minimizeMenuStore.actions;

// export default minimizeMenuStore.reducer;
