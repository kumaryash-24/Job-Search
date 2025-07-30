import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  myApplications: [],
  recruiterApplications: [],
};

const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    setMyApplications: (state, action) => {
      state.myApplications = action.payload;
    },
    setRecruiterApplications: (state, action) => {
      state.recruiterApplications = action.payload;
    },
    updateApplicationStatus: (state, action) => {
      const index = state.recruiterApplications.findIndex(app => app._id === action.payload._id);
      if (index !== -1) {
        state.recruiterApplications[index].status = action.payload.status;
      }
    },
    addMyApplication: (state, action) => {
        state.myApplications.push(action.payload);
    }
  },
});

export const { setMyApplications, setRecruiterApplications, updateApplicationStatus, addMyApplication } = applicationSlice.actions;
export default applicationSlice.reducer;