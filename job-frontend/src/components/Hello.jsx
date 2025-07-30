import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutSuccess, updateProfileSuccess } from '../redux/authSlice';
import { setJobs } from '../redux/jobSlice';
import { setMyApplications, addMyApplication } from '../redux/applicationSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Hello = () => {
  const { user } = useSelector((state) => state.auth);
  const { jobs: allJobs } = useSelector((state) => state.job);
  const { myApplications } = useSelector((state) => state.application);
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({ fullname: '', email: '', phoneNumber: '' });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [resume, setResume] = useState(null);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const appliedJobIds = new Set(myApplications.map(app => app.job._id));

  useEffect(() => {
    if (user) {
      setProfileData({ fullname: user.fullname, email: user.email, phoneNumber: user.phoneNumber });
      const fetchInitialData = async () => {
        try {
          const [jobsRes, appsRes] = await Promise.all([
            axios.get('http://localhost:8000/api/v1/jobs', { withCredentials: true }),
            axios.get('http://localhost:8000/api/v1/application/my', { withCredentials: true })
          ]);
          if (jobsRes.data.success) dispatch(setJobs(jobsRes.data.jobs));
          if (appsRes.data.success) dispatch(setMyApplications(appsRes.data.applications));
        } catch (err) {
          toast.error("Could not load data.");
        }
      };
      fetchInitialData();
    }
  }, [user, dispatch]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('fullname', profileData.fullname);
    formData.append('email', profileData.email);
    formData.append('phoneNumber', profileData.phoneNumber);
    if (profilePhoto) formData.append('profilePhoto', profilePhoto);
    if (resume) formData.append('resume', resume);

    try {
      const res = await axios.put('http://localhost:8000/api/v1/user/profile/update', formData, { withCredentials: true });
      if (res.data.success) {
        dispatch(updateProfileSuccess(res.data.user));
        toast.success(res.data.message);
        setIsEditingProfile(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Profile update failed');
    }
  };

  const handleApply = async (jobId) => {
    if (!user.profile.resume) {
        toast.error("Please upload your resume before applying.");
        setIsEditingProfile(true);
        return;
    }
    try {
        const res = await axios.post(`http://localhost:8000/api/v1/application/apply/${jobId}`, {}, { withCredentials: true });
        if (res.data.success) {
            toast.success(res.data.message);
            const newApp = { ...res.data.application, job: allJobs.find(j => j._id === jobId) };
            dispatch(addMyApplication(newApp));
        }
    } catch (err) {
        toast.error(err.response?.data?.message || "Application failed.");
    }
  };

  const getStatusBadge = (status) => {
    const styles = { pending: 'bg-warning text-dark', approved: 'bg-success', rejected: 'bg-danger' };
    return styles[status] || 'bg-secondary';
  };

  if (!user) return <p className="text-center mt-5">Loading...</p>;

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={4000} />
      <div className="container mt-5 py-4">
        <h2 className="text-center display-5 fw-bold text-primary mb-4">Hello, {user.fullname} 👋</h2>
        {user.profile?.profilePhoto && <div className="text-center mb-3"><img src={user.profile.profilePhoto} alt="Profile" className="shadow" style={{ width: '130px', height: '130px', objectFit: 'cover', borderRadius: '50%', border: '3px solid #0d6efd' }}/></div>}
        <div className="text-center fs-5 mb-4"><p><strong>Email:</strong> {user.email}</p><p><strong>Role:</strong> {user.role}</p></div>
        <div className="text-center mb-4 d-flex justify-content-center gap-3 flex-wrap">
          <button onClick={() => setIsEditingProfile(!isEditingProfile)} className="btn btn-outline-primary px-4 shadow">{isEditingProfile ? 'Cancel Edit' : 'Edit Profile'}</button>
          <a href="http://localhost:8000/api/v1/user/download-resume" target="_blank" rel="noopener noreferrer" className="btn btn-success px-4 shadow">Download Resume</a>
        </div>
        {isEditingProfile && (
          <form onSubmit={handleProfileUpdate} className="card p-4 mb-4 shadow-lg bg-light">
            <h5 className="text-center mb-3 text-primary">Update Your Profile</h5>
            <input type="text" name="fullname" value={profileData.fullname} onChange={(e) => setProfileData({...profileData, fullname: e.target.value})} className="form-control mb-3" required />
            <input type="email" name="email" value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})} className="form-control mb-3" required />
            <input type="text" name="phoneNumber" value={profileData.phoneNumber} onChange={(e) => setProfileData({...profileData, phoneNumber: e.target.value})} className="form-control mb-3" required />
            <label className="form-label">Upload Profile Photo</label>
            <input type="file" onChange={(e) => setProfilePhoto(e.target.files[0])} className="form-control mb-3" accept="image/*" />
            <label className="form-label">Upload Resume (PDF)</label>
            <input type="file" onChange={(e) => setResume(e.target.files[0])} className="form-control mb-4" accept=".pdf" />
            <button type="submit" className="btn btn-primary w-100 shadow">Save Changes</button>
          </form>
        )}
        <div className="my-5">
            <h3 className="text-center text-dark border-bottom pb-2 mb-4">My Applications</h3>
            {myApplications.length > 0 ? <div className="list-group">{myApplications.map(app => (<div key={app._id} className="list-group-item d-flex justify-content-between align-items-center"><div><h5 className="mb-1">{app.job.title}</h5><p className="mb-1 text-muted">{app.job.location}</p></div><span className={`badge ${getStatusBadge(app.status)} p-2`}>{app.status}</span></div>))}</div> : <p className="text-center text-muted">You haven't applied to any jobs yet.</p>}
        </div>
        <h3 className="mt-5 mb-3 text-center text-dark border-bottom pb-2">Available Jobs</h3>
        <div className="row row-cols-1 row-cols-md-3 g-4 mt-2">{allJobs.map((job) => (<div className="col" key={job._id}><div className="card h-100 shadow-sm"><div className="card-body"><h5 className="card-title text-primary">{job.title}</h5><p className="card-text text-muted">{job.description}</p><p className="mb-1"><strong>Location:</strong> {job.location}</p></div><div className="card-footer bg-transparent border-0 text-center"><button className={`btn w-100 shadow-sm ${appliedJobIds.has(job._id) ? 'btn-secondary' : 'btn-outline-primary'}`} onClick={() => handleApply(job._id)} disabled={appliedJobIds.has(job._id)}>{appliedJobIds.has(job._id) ? 'Applied' : 'Apply Now'}</button></div></div></div>))}</div>
      </div>
    </>
  );
};

export default Hello;