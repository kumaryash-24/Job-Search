import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
    logoutRequest: (state) => {
      state.loading = true;
    },
    logoutSuccess: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
    logoutFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    registerRequest: (state) => {
        state.loading = true;
    },
    registerSuccess: (state) => {
        state.loading = false;
        state.error = null;
    },
    registerFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    updateProfileRequest: (state) => {
        state.loading = true;
    },
    updateProfileSuccess: (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
    },
    updateProfileFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    // --- These reducers were defined but not exported ---
    checkAuthSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.loading = false;
    },
    checkAuthFailure: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
    }
  },
});

// ---> FIX: Add checkAuthSuccess and checkAuthFailure to the export list <---
export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFailure,
  checkAuthSuccess,    // This was missing
  checkAuthFailure,    // This was missing
} = authSlice.actions;

export default authSlice.reducer;