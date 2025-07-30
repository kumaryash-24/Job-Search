import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    users: [],
    jobs: [],
    stats: null,
    recentSignups: [], // ---> NEW STATE
    loading: false,
    error: null,
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        setLoading: (state, action) => { state.loading = action.payload; },
        setError: (state, action) => { state.error = action.payload; state.loading = false; },
        setAdminData: (state, action) => {
            if (action.payload.stats) state.stats = action.payload.stats;
            if (action.payload.users) state.users = action.payload.users;
            if (action.payload.jobs) state.jobs = action.payload.jobs;
            if (action.payload.recentSignups) state.recentSignups = action.payload.recentSignups; // ---> SET NEW STATE
            state.loading = false;
            state.error = null;
        },
        removeUserById: (state, action) => {
            state.users = state.users.filter(user => user._id !== action.payload);
            if (state.stats) state.stats.totalUsers -= 1;
        },
        removeJobById: (state, action) => {
            state.jobs = state.jobs.filter(job => job._id !== action.payload);
            if (state.stats) state.stats.totalJobs -= 1;
        },
        // ---> NEW REDUCER to update user status in the list <---
        updateUserStatusInState: (state, action) => {
            const index = state.users.findIndex(user => user._id === action.payload._id);
            if (index !== -1) {
                state.users[index].isActive = action.payload.isActive;
            }
        },
        // ---> NEW REDUCER to update job status in the list <---
        updateJobStatusInState: (state, action) => {
            const index = state.jobs.findIndex(job => job._id === action.payload._id);
            if (index !== -1) {
                state.jobs[index].status = action.payload.status;
            }
        }
    },
});

export const { 
    setLoading, 
    setError, 
    setAdminData, 
    removeUserById, 
    removeJobById,
    updateUserStatusInState, // ---> EXPORT
    updateJobStatusInState   // ---> EXPORT
} = adminSlice.actions;

export default adminSlice.reducer;