import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import jobReducer from './jobSlice';
import adminReducer from './adminSlice';
import applicationReducer from './applicationSlice'; // ---> IMPORT

export const store = configureStore({
  reducer: {
    auth: authReducer,
    job: jobReducer,
    admin: adminReducer,
    application: applicationReducer, // ---> ADD
  },
});