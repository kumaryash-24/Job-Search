import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setLoading, setError, setAdminData, removeJobById, updateJobStatusInState } from '../redux/adminSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const AdminJobs = () => {
    const dispatch = useDispatch();
    const { jobs, loading, error } = useSelector(state => state.admin);

    useEffect(() => {
        const fetchJobs = async () => {
            dispatch(setLoading(true));
            try {
                const res = await axios.get('http://localhost:8000/api/v1/admin/jobs');
                dispatch(setAdminData({ jobs: res.data.jobs }));
            } catch (err) {
                dispatch(setError(err.response?.data?.message || "Could not fetch jobs."));
            }
        };
        fetchJobs();
    }, [dispatch]);

    const handleToggleStatus = async (jobId) => {
        try {
            const res = await axios.put(`http://localhost:8000/api/v1/admin/jobs/${jobId}/toggle-status`);
            if (res.data.success) {
                toast.success(res.data.message);
                dispatch(updateJobStatusInState(res.data.job));
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update status.");
        }
    };
    
    const handleDeleteJob = async (jobId) => {
        if (window.confirm("Are you sure? This will delete the job and all its applications.")) {
            try {
                const res = await axios.delete(`http://localhost:8000/api/v1/admin/jobs/${jobId}`);
                toast.success(res.data.message);
                dispatch(removeJobById(jobId));
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to delete job.");
            }
        }
    };

    if (loading) return <div className="text-center mt-5"><h4>Loading Jobs...</h4></div>;
    if (error) return <div className="text-center mt-5 text-danger"><h4>Error: {error}</h4></div>;

    return (
        <>
            <br />
            <ToastContainer position="bottom-right" autoClose={3000} theme="light" />
            <div className="container mt-5 py-4">
                <div className="d-flex justify-content-between align-items-center mb-4"> 
                    <h1 className="fw-bold">Job Management</h1>
                    <Link to="/admin/dashboard" className="btn btn-outline-secondary">Back to Dashboard</Link>
                </div>
                <div className="card shadow-sm">
                    <div className="card-header bg-light fw-semibold">All Job Postings</div>
                    <div className="table-responsive">
                        <table className="table table-striped mb-0">
                            <thead className="table-light">
                                <tr><th>Title</th><th>Location</th><th>Status</th><th className="text-center">Actions</th></tr>
                            </thead>
                            <tbody>
                                {jobs?.map(job => (
                                    <tr key={job._id}>
                                        <td>{job.title}</td>
                                        <td>{job.location}</td>
                                        <td><span className={`badge ${job.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>{job.status}</span></td>
                                        <td className="text-center">
                                            <button className="btn btn-sm btn-outline-warning me-2" onClick={() => handleToggleStatus(job._id)}>Toggle Status</button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteJob(job._id)}>Delete</button>
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

export default AdminJobs;