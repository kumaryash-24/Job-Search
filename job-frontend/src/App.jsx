import React, { useEffect } from 'react'; // <-- IMPORT useEffect
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/Nav';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Hello from './components/Hello';
import Recruit from './components/Recruit';
import Explore from './components/Explore';
import { Provider, useDispatch } from 'react-redux'; // <-- IMPORT useDispatch
import { store } from './redux/store';
import axios from 'axios'; // <-- IMPORT axios
import { checkAuthSuccess, checkAuthFailure } from './redux/authSlice'; // <-- IMPORT auth actions

// ---> IMPORT THE ADMIN COMPONENTS <---
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './components/AdminDashboard';
import AdminUsers from './components/AdminUsers'; // This was missing from your previous App.jsx
import AdminJobs from './components/AdminJobs';   // This was also missing

// Create a new wrapper component to handle the one-time authentication check
const AppWrapper = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // This effect runs only ONCE when the application first loads, fixing the logout bug.
    const checkAuth = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/v1/user/check-auth', {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(checkAuthSuccess(res.data.user));
        } else {
          dispatch(checkAuthFailure());
        }
      } catch (err) {
        dispatch(checkAuthFailure());
      }
    };
    checkAuth();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        {/* --- Your Existing Public Routes --- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/hello" element={<Hello />} />
        <Route path="/recruit" element={<Recruit />} />
        <Route path="/explore" element={<Explore />} />

        {/* --- UPDATED & FIXED PROTECTED ADMIN ROUTES --- */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          {/* FIX: Add the routes for the user and job management pages */}
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/jobs" element={<AdminJobs />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

// The main App component now uses the wrapper
function App() {
  return (
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  );
}

export default App;