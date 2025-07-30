import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setLoading, setError, setAdminData } from '../redux/adminSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom'; 

axios.defaults.withCredentials = true;

const StatCard = ({ icon, title, value, bgColor, linkTo }) => (
  <Link to={linkTo} className="text-decoration-none">
    <div className={`card shadow-sm text-center ${bgColor} text-white h-100`}>
      <div className="card-body d-flex flex-column justify-content-center">
        <div className="mb-2">{icon}</div>
        <h5 className="card-title fw-semibold">{title}</h5>
        <h3 className="card-text">{value ?? 0}</h3>
      </div>
    </div>
  </Link>
);
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-people-fill" viewBox="0 0 16 16"><path d="M13 7c0 1.104-.896 2-2 2s-2-.896-2-2 .896-2 2-2 2 .896 2 2zm-7 0c0 1.104-.896 2-2 2s-2-.896-2-2 .896-2 2-2 2 .896 2 2zM4.216 12.275a5.02 5.02 0 0 1 3.567-.225A6.978 6.978 0 0 0 8 13H1c0-.786.24-1.518.648-2.138.524.185 1.05.34 1.568.464zM14.5 13c0-.997-.234-1.94-.648-2.775a6.978 6.978 0 0 0-2.84-.813c.683.718 1.087 1.678 1.087 2.775H14.5z" /></svg>;
const JobsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-briefcase-fill" viewBox="0 0 16 16"><path d="M6.5 0a.5.5 0 0 0-.5.5V2H3a2 2 0 0 0-2 2v1h14V4a2 2 0 0 0-2-2H10V.5a.5.5 0 0 0-.5-.5h-3zM7 2V1h2v1H7zM0 8V5h16v3H0zm0 1h16v3a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V9z" /></svg>;

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, recentSignups, loading, error } = useSelector(state => state.admin);

  useEffect(() => {
    const fetchStats = async () => {
      dispatch(setLoading(true));
      try {
        const res = await axios.get('http://localhost:8000/api/v1/admin/stats');
        dispatch(setAdminData({ 
            stats: res.data.stats, 
            recentSignups: res.data.recentSignups 
        }));
      } catch (err) {
        dispatch(setError(err.response?.data?.message || "Could not fetch dashboard data."));
      }
    };
    fetchStats();
  }, [dispatch]);

  if (loading) return <div className="text-center mt-5"><h4>Loading Dashboard...</h4></div>;
  if (error) return <div className="text-center mt-5 text-danger"><h4>Error: {error}</h4></div>;

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} theme="light" />
      <div className="container py-5">
        <div className="text-center mb-5"><br />
          <h1 className="fw-bold">Admin Dashboard</h1>
          <p className="text-muted">An overview of your platform's activity.</p>
        </div>
        <div className="row g-4 mb-5">
          <div className="col-md-6"><StatCard icon={<UsersIcon />} title="Manage Users" value={stats?.totalUsers} bgColor="bg-primary" linkTo="/admin/users" /></div>
          <div className="col-md-6"><StatCard icon={<JobsIcon />} title="Manage Jobs" value={stats?.totalJobs} bgColor="bg-info" linkTo="/admin/jobs" /></div>
        </div>
        <div className="card shadow-sm">
            <div className="card-header bg-light fw-semibold">Recent Signups</div>
            <div className="table-responsive">
                <table className="table table-striped mb-0">
                    <thead className="table-light">
                        <tr><th>Full Name</th><th>Email</th><th>Date Joined</th></tr>
                    </thead>
                    <tbody>
                        {recentSignups?.map(user => (
                            <tr key={user._id}>
                                <td>{user.fullname}</td>
                                <td>{user.email}</td>
                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;