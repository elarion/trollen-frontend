import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {  username: null, email: null, password:null, confirmPassword: null, has_consent: null },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginData: (state, action) => {
      state.value = action.payload;
    },
    logout: (state) => {
      state.value.token = null;
      state.value.username = null;
    },
  },
});

export const { loginData, logout } = userSlice.actions;
export default userSlice.reducer;
