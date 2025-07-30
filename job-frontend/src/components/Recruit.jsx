import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutSuccess, updateProfileSuccess } from '../redux/authSlice';
import { setJobs, addJob, updateJob as updateJobAction, deleteJob as deleteJobAction } from '../redux/jobSlice';
import { setRecruiterApplications, updateApplicationStatus } from '../redux/applicationSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Recruit = () => {
  const { user } = useSelector(state => state.auth);
  const { jobs } = useSelector(state => state.job);
  const { recruiterApplications } = useSelector(state => state.application);
  
  const [jobData, setJobData] = useState({ title: '', description: '', location: '', salary: '' });
  const [editingJobId, setEditingJobId] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({ fullname: '', email: '', phoneNumber: '' });
  const [activeAccordion, setActiveAccordion] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const groupedApplications = useMemo(() => recruiterApplications.reduce((acc, app) => {
    if (!app || !app.job) return acc;
    const jobId = app.job._id;
    if (!acc[jobId]) acc[jobId] = { jobTitle: app.job.title, applicants: [] };
    acc[jobId].applicants.push(app);
    return acc;
  }, {}), [recruiterApplications]);

  useEffect(() => {
    if (user) {
      setProfileData({ fullname: user.fullname, email: user.email, phoneNumber: user.phoneNumber });
      const fetchRecruiterData = async () => {
        try {
          const [jobsRes, appsRes] = await Promise.all([
            axios.get("http://localhost:8000/api/v1/jobs/my", { withCredentials: true }),
            axios.get("http://localhost:8000/api/v1/application/recruiter", { withCredentials: true })
          ]);
          if (jobsRes.data.success) dispatch(setJobs(jobsRes.data.jobs));
          if (appsRes.data.success) dispatch(setRecruiterApplications(appsRes.data.applications));
        } catch (error) {
          toast.error("Could not load your dashboard data.");
        }
      };
      fetchRecruiterData();
    }
  }, [user, dispatch]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", profileData.fullname);
    formData.append("email", profileData.email);
    formData.append("phoneNumber", profileData.phoneNumber);
    try {
      const res = await axios.put("http://localhost:8000/api/v1/user/profile/update", formData, { withCredentials: true });
      if (res.data.success) {
        dispatch(updateProfileSuccess(res.data.user));
        toast.success("Profile updated successfully!");
        setIsEditingProfile(false);
      }
    } catch (err) {
      toast.error("Profile update failed");
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      if (editingJobId) {
        const res = await axios.put(`http://localhost:8000/api/v1/jobs/${editingJobId}`, jobData, { withCredentials: true });
        dispatch(updateJobAction(res.data.job));
        setEditingJobId(null);
        toast.success(res.data.message);
      } else {
        const res = await axios.post('http://localhost:8000/api/v1/jobs', jobData, { withCredentials: true });
        dispatch(addJob(res.data.job));
        toast.success(res.data.message);
      }
      setJobData({ title: '', description: '', location: '', salary: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post job');
    }
  };

  const handleEdit = (job) => {
    setJobData({ title: job.title, description: job.description, location: job.location, salary: job.salary });
    setEditingJobId(job._id);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job? This will also remove all applications for it.")) {
        try {
            const res = await axios.delete(`http://localhost:8000/api/v1/jobs/${jobId}`, { withCredentials: true });
            if (res.data.success) {
                dispatch(deleteJobAction(jobId));
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error("Failed to delete job");
        }
    }
  };

  const handleUpdateStatus = async (applicationId, status) => {
    try {
        const res = await axios.put(`http://localhost:8000/api/v1/application/update/${applicationId}`, { status }, { withCredentials: true });
        if (res.data.success) {
            toast.success(res.data.message);
            dispatch(updateApplicationStatus(res.data.application));
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to update status.");
    }
  };

  const handleAccordionToggle = (jobId) => {
    setActiveAccordion(activeAccordion === jobId ? null : jobId);
  };

  if (!user) return <p className="text-center mt-5">Loading...</p>;

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div className="container mt-5 py-4">
        <h2 className="text-center text-primary fw-bold mb-4">Recruiter Dashboard</h2>
        <div className="card mb-4 shadow-sm"><div className="card-body"><h4 className="fw-bold mb-0">{user.fullname}</h4><p className="mb-1 mt-2"><strong>Email:</strong> {user.email}</p><p className="mb-1"><strong>Phone:</strong> {user.phoneNumber}</p><div className="mt-3"><button className="btn btn-outline-primary" onClick={() => setIsEditingProfile(!isEditingProfile)}>{isEditingProfile ? 'Cancel Edit' : 'Edit Profile'}</button></div></div></div>
        {isEditingProfile && <div className="card mb-4 shadow-sm"><div className="card-body"><h5 className="text-primary mb-3">Update Profile Info</h5><form onSubmit={handleProfileUpdate}><div className="row g-3"><div className="col-md-6"><input type="text" name="fullname" value={profileData.fullname} onChange={(e) => setProfileData({...profileData, fullname: e.target.value})} className="form-control" placeholder="Full Name" required /></div><div className="col-md-6"><input type="text" name="phoneNumber" value={profileData.phoneNumber} onChange={(e) => setProfileData({...profileData, phoneNumber: e.target.value})} className="form-control" placeholder="Phone Number" required /></div></div><button type="submit" className="btn btn-primary mt-3">Save Changes</button></form></div></div>}
        <div className="card mb-4 shadow-sm"><div className="card-body"><h5 className="text-primary mb-3">{editingJobId ? 'Update Job' : 'Post New Job'}</h5><form onSubmit={handlePostJob}><div className="row g-3"><div className="col-md-6"><input type="text" name="title" value={jobData.title} onChange={(e) => setJobData({...jobData, title: e.target.value})} className="form-control" placeholder="Job Title" required /></div><div className="col-md-6"><input type="text" name="location" value={jobData.location} onChange={(e) => setJobData({...jobData, location: e.target.value})} className="form-control" placeholder="Location" required /></div><div className="col-12"><textarea name="description" value={jobData.description} onChange={(e) => setJobData({...jobData, description: e.target.value})} className="form-control" placeholder="Description" rows="3" required /></div><div className="col-md-6"><input type="number" name="salary" value={jobData.salary} onChange={(e) => setJobData({...jobData, salary: e.target.value})} className="form-control" placeholder="Salary" required /></div><div className="col-md-6 text-end"><button type="submit" className="btn btn-primary w-100">{editingJobId ? 'Update Job' : 'Post Job'}</button></div></div></form></div></div>
        
        <div className="card shadow-sm mt-5">
            <div className="card-header bg-light fw-semibold">Received Applications</div>
            <div className="card-body">
                {Object.keys(groupedApplications).length === 0 ? (<p className="text-muted text-center">No applications received yet.</p>) : (
                    <div className="accordion" id="applicationsAccordion">
                        {Object.entries(groupedApplications).map(([jobId, data]) => (
                            <div className="accordion-item" key={jobId}>
                                <h2 className="accordion-header" id={`heading-${jobId}`}>
                                    <button className={`accordion-button ${activeAccordion === jobId ? '' : 'collapsed'}`} type="button" onClick={() => handleAccordionToggle(jobId)}>
                                        {data.jobTitle} <span className="badge bg-primary ms-2">{data.applicants.length}</span>
                                    </button>
                                </h2>
                                <div id={`collapse-${jobId}`} className={`accordion-collapse collapse ${activeAccordion === jobId ? 'show' : ''}`}>
                                    <div className="accordion-body p-0">
                                        <ul className="list-group list-group-flush">
                                            {/* ---> FIX: Add a filter to safely skip applications where the applicant has been deleted <--- */}
                                            {data.applicants.filter(app => app.applicant).map(app => (
                                                <li key={app._id} className="list-group-item">
                                                    <div className="d-flex w-100 justify-content-between align-items-center">
                                                        <div>
                                                            <h6 className="mb-0 fw-bold">{app.applicant.fullname}</h6>
                                                            <small className="text-muted">{app.applicant.email}</small>
                                                        </div>
                                                        <span className={`badge ${app.status === 'approved' ? 'bg-success' : app.status === 'rejected' ? 'bg-danger' : 'bg-warning text-dark'}`}>{app.status}</span>
                                                    </div>
                                                    <div className="mt-2 pt-2 border-top">
                                                        <a href={app.applicant.profile.resume} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-info me-2">View Resume</a>
                                                        {app.status === 'pending' && (
                                                            <>
                                                                <button onClick={() => handleUpdateStatus(app._id, 'approved')} className="btn btn-sm btn-outline-success me-2">Approve</button>
                                                                <button onClick={() => handleUpdateStatus(app._id, 'rejected')} className="btn btn-sm btn-outline-danger">Reject</button>
                                                            </>
                                                        )}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
        <div className="card shadow-sm bg-light mt-5"><div className="card-body"><h5 className="text-primary mb-3">Your Posted Jobs</h5>{jobs.length === 0 ? <p className="text-muted">You haven’t posted any jobs yet.</p> : <div className="row row-cols-1 row-cols-md-2 g-4">{jobs.map((job) => (<div className="col" key={job._id}><div className="card h-100 border-0 shadow-sm"><div className="card-body"><h6 className="fw-bold">{job.title}</h6><p className="mb-1"><strong>Location:</strong> {job.location}</p><p className="mb-2"><strong>Salary:</strong> ₹{job.salary}</p></div><div className="card-footer bg-transparent border-0 d-flex justify-content-between"><button className="btn btn-outline-success btn-sm" onClick={() => handleEdit(job)}>Edit</button><button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(job._id)}>Delete</button></div></div></div>))}</div>}</div></div>
      </div>
    </>
  );
};

export default Recruit;