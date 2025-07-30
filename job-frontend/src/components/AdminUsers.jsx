import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setLoading, setError, setAdminData, removeUserById, updateUserStatusInState } from '../redux/adminSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const AdminUsers = () => {
    const dispatch = useDispatch();
    const { users, loading, error } = useSelector(state => state.admin);

    useEffect(() => {
        const fetchUsers = async () => {
            dispatch(setLoading(true));
            try {
                const res = await axios.get('http://localhost:8000/api/v1/admin/users');
                dispatch(setAdminData({ users: res.data.users }));
            } catch (err) {
                dispatch(setError(err.response?.data?.message || "Could not fetch users."));
            }
        };
        fetchUsers();
    }, [dispatch]);

    const handleToggleStatus = async (userId) => {
        try {
            const res = await axios.put(`http://localhost:8000/api/v1/admin/users/${userId}/toggle-status`);
            if (res.data.success) {
                toast.success(res.data.message);
                dispatch(updateUserStatusInState(res.data.user));
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update status.");
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure? This will delete the user and all their applications.")) {
            try {
                const res = await axios.delete(`http://localhost:8000/api/v1/admin/users/${userId}`);
                toast.success(res.data.message);
                dispatch(removeUserById(userId));
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to delete user.");
            }
        }
    };

    if (loading) return <div className="text-center mt-5"><h4>Loading Users...</h4></div>;
    if (error) return <div className="text-center mt-5 text-danger"><h4>Error: {error}</h4></div>;

    return (
        <>
            <br />
            <ToastContainer position="bottom-right" autoClose={3000} theme="light" />
            <div className="container mt-5 py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="fw-bold">User Management</h1> 
                    <Link to="/admin/dashboard" className="btn btn-outline-secondary">Back to Dashboard</Link>
                </div>
                <div className="card shadow-sm">
                    <div className="card-header bg-light fw-semibold">All Platform Users</div>
                    <div className="table-responsive">
                        <table className="table table-striped mb-0">
                            <thead className="table-light">
                                <tr><th>Full Name</th><th>Email</th><th>Role</th><th>Status</th><th className="text-center">Actions</th></tr>
                            </thead>
                            <tbody>
                                {users?.map(user => (
                                    <tr key={user._id}>
                                        <td>{user.fullname}</td>
                                        <td>{user.email}</td>
                                        <td className="text-capitalize">{user.role}</td>
                                        <td><span className={`badge ${user.isActive ? 'bg-success' : 'bg-secondary'}`}>{user.isActive ? 'Active' : 'Inactive'}</span></td>
                                        <td className="text-center">
                                            <button className="btn btn-sm btn-outline-warning me-2" onClick={() => handleToggleStatus(user._id)}>Toggle Status</button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteUser(user._id)}>Delete</button>
                                        </td>
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

export default AdminUsers;