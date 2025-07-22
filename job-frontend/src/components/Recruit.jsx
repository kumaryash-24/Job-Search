import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Recruit = () => {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    location: '',
    salary: ''
  });
  const [editingJobId, setEditingJobId] = useState(null);
  const [message, setMessage] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    fullname: '',
    email: '',
    phoneNumber: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecruiter = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/v1/user/me', { withCredentials: true });
        if (res.data.success) {
          const userData = res.data.user;
          setUser(userData);
          setProfileData({
            fullname: userData.fullname,
            email: userData.email,
            phoneNumber: userData.phoneNumber
          });
        }
      } catch (error) {
        console.error('Failed to fetch recruiter info');
      }
    };
    fetchRecruiter();
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/jobs/my", {
          withCredentials: true
        });
        if (res.data.success) {
          setJobs(res.data.jobs);
        }
      } catch (error) {
        console.error("Failed to fetch jobs");
      }
    };
    fetchJobs();
  }, [message]);

  const handleLogout = async () => {
    await axios.get('http://localhost:8000/api/v1/user/logout', {
      withCredentials: true
    });
    navigate('/');
  };

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("fullname", profileData.fullname);
      formData.append("email", profileData.email);
      formData.append("phoneNumber", profileData.phoneNumber);

      const res = await axios.put(
        "http://localhost:8000/api/v1/user/profile/update",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      if (res.data.success) {
        setMessage(res.data.message);
        setUser(res.data.user);
        setIsEditingProfile(false);
      }
    } catch (err) {
      setMessage("Profile update failed");
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editingJobId) {
        res = await axios.put(
          `http://localhost:8000/api/v1/jobs/${editingJobId}`,
          jobData,
          { withCredentials: true }
        );
        setEditingJobId(null);
      } else {
        res = await axios.post(
          'http://localhost:8000/api/v1/jobs',
          jobData,
          { withCredentials: true }
        );
      }

      setMessage(res.data.message);
      setJobData({ title: '', description: '', location: '', salary: '' });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to post job');
    }
  };

  const handleEdit = (job) => {
    setJobData({
      title: job.title,
      description: job.description,
      location: job.location,
      salary: job.salary
    });
    setEditingJobId(job._id);
  };

  const handleDelete = async (jobId) => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/jobs/${jobId}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setMessage(res.data.message);
      }
    } catch (error) {
      console.error("Failed to delete job");
    }
  };

  return (
    <>
    
    <div className="container mt-5 py-5 bg-dark min-vh-100">
      <h2 className="text-center text-primary fw-bold mb-4">Recruiter Dashboard 👔</h2>

      {message && (
        <div className="alert alert-info alert-dismissible fade show" role="alert">
          {message}
          <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
        </div>
      )}

      {user && (
        <div className="card mb-4 shadow-sm">
          <div className="card-body d-flex flex-column flex-md-row align-items-center gap-4">
            {user.profile?.profilePhoto && (
              <img
                src={user.profile.profilePhoto}
                alt="Profile"
                className="rounded-circle"
                style={{ width: '120px', height: '120px', objectFit: 'cover', border: '4px solid #0d6efd' }}
              />
            )}
            <div className="flex-grow-1">
              <h4 className="fw-bold mb-0">{user.fullname}</h4>
              <small className="text-muted">Role: {user.role}</small>
              <p className="mb-1 mt-2"><strong>Email:</strong> {user.email}</p>
              <p className="mb-1"><strong>Phone:</strong> {user.phoneNumber}</p>
              <div className="mt-3 d-flex gap-2 flex-wrap">
                <button className="btn btn-outline-primary" onClick={() => setIsEditingProfile(!isEditingProfile)}>
                  {isEditingProfile ? 'Cancel Edit' : 'Edit Profile'}
                </button>
                <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditingProfile && (
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <h5 className="text-success mb-3">Update Profile Info</h5>
            <form onSubmit={handleProfileUpdate}>
              <div className="row g-3">
                <div className="col-md-4">
                  <input type="text" name="fullname" value={profileData.fullname} onChange={handleProfileChange} className="form-control" placeholder="Full Name" required />
                </div>
                {/* <div className="col-md-4">
                  <input type="email" name="email" value={profileData.email} onChange={handleProfileChange} className="form-control" placeholder="Email" required />
                </div> */}
                <div className="col-md-4">
                  <input type="text" name="phoneNumber" value={profileData.phoneNumber} onChange={handleProfileChange} className="form-control" placeholder="Phone Number" required />
                </div>
              </div>
              <button type="submit" className="btn btn-success mt-3">Save Changes</button>
            </form>
          </div>
        </div>
      )}

      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="text-primary mb-3">{editingJobId ? 'Update Job' : 'Post New Job'}</h5>
          <form onSubmit={handlePostJob}>
            <div className="row g-3">
              <div className="col-md-6">
                <input type="text" name="title" value={jobData.title} onChange={handleChange} className="form-control" placeholder="Job Title" required />
              </div>
              <div className="col-md-6">
                <input type="text" name="location" value={jobData.location} onChange={handleChange} className="form-control" placeholder="Location" required />
              </div>
              <div className="col-12">
                <textarea name="description" value={jobData.description} onChange={handleChange} className="form-control" placeholder="Description" rows="3" required />
              </div>
              <div className="col-md-6">
                <input type="number" name="salary" value={jobData.salary} onChange={handleChange} className="form-control" placeholder="Salary" required />
              </div>
              <div className="col-md-6 text-end">
                <button type="submit" className="btn btn-primary w-100">{editingJobId ? 'Update Job' : 'Post Job'}</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Posted Jobs Grid (3 per row) */}
      <div className="card shadow-sm bg-light">
        <div className="card-body">
          <h5 className="text-primary mb-3">Your Posted Jobs</h5>
          {jobs.length === 0 ? (
            <p className="text-muted">You haven’t posted any jobs yet.</p>
          ) : (
            <div className="row row-cols-1 row-cols-md-3 g-4">
              {jobs.map((job) => (
                <div className="col" key={job._id}>
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                      <h6 className="fw-bold">{job.title}</h6>
                      <p className="mb-1"><strong>Description:</strong> {job.description}</p>
                      <p className="mb-1"><strong>Location:</strong> {job.location}</p>
                      <p className="mb-2"><strong>Salary:</strong> ₹{job.salary}</p>
                    </div>
                    <div className="card-footer bg-transparent border-0 d-flex justify-content-between">
                      <button className="btn btn-outline-success btn-sm" onClick={() => handleEdit(job)}>Edit</button>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(job._id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div></>
  );
};

export default Recruit;
