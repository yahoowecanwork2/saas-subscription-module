import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    auth: false,
    registerData: null,
  },
  reducers: {
    setRegisterData: (state, action) => {
      state.registerData = action.payload;
    },
    clearRegisterData: (state) => {
      state.registerData = null;
    },
    setAuth: (state, action) => {
      state.auth = action.payload;
    },
    clearAuth: (state) => {
      state.auth = false;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const {
  setRegisterData,
  clearRegisterData,
  setUser,
  clearUser,
  setAuth,
  clearAuth,
} = userSlice.actions;
