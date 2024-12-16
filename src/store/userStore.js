import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: {},
  userData: {},
  loaded: false,
};

/* eslint-disable no-param-reassign */
export const userStore = createSlice({
  name: 'user',
  initialState,
  reducers: {
    changeUserData: (state, action) => {
      state.data =
        action.payload ||
        JSON.parse(localStorage.getItem('user') || JSON.stringify({}));
    },
    changeUser: (state, action) => {
      state.userData = action.payload;
    },
    changeLoaded: (state, action) => {
      state.loaded = action.payload;
    },
  },
});
/* eslint-enable no-param-reassign */

export const { changeUserData, changeUser, changeLoaded } = userStore.actions;

// export default userStore.reducer;
