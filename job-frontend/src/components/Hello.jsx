import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Hello = () => {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    fullname: '',
    email: '',
    phoneNumber: ''
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [resume, setResume] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileAndJobs = async () => {
      try {
        const userRes = await axios.get('http://localhost:8000/api/v1/user/me', {
          withCredentials: true
        });

        if (userRes.data.success) {
          const userInfo = userRes.data.user;
          setUser(userInfo);
          setProfileData({
            fullname: userInfo.fullname,
            email: userInfo.email,
            phoneNumber: userInfo.phoneNumber
          });
        } else {
          setError('Failed to fetch user profile');
        }

        const jobRes = await axios.get('http://localhost:8000/api/v1/jobs/my', {
          withCredentials: true
        });

        if (jobRes.data.success) {
          setJobs(jobRes.data.jobs);
        } else {
          setError('Failed to fetch jobs');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.response?.data?.message || 'Failed to load data');
      }
    };

    fetchProfileAndJobs();
  }, []);

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/v1/jobs', {
          withCredentials: true
        });
        if (res.data.success) {
          setAllJobs(res.data.jobs);
        } else {
          setError('Failed to fetch public jobs');
        }
      } catch (err) {
        console.error('Public job fetch error:', err);
      }
    };

    fetchAllJobs();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:8000/api/v1/user/logout', {
        withCredentials: true
      });
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage('');

    const formData = new FormData();
    formData.append('fullname', profileData.fullname);
    formData.append('email', profileData.email);
    formData.append('phoneNumber', profileData.phoneNumber);
    if (profilePhoto) formData.append('profilePhoto', profilePhoto);
    if (resume) formData.append('resume', resume);

    try {
      const res = await axios.put(
        'http://localhost:8000/api/v1/user/profile/update',
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (res.data.success) {
        setUser(res.data.user);
        setMessage(res.data.message);
        setIsEditingProfile(false);
        setProfilePhoto(null);
        setResume(null);
      } else {
        setMessage(res.data.message || 'Profile update failed');
      }
    } catch (err) {
      console.error('Update error:', err.response?.data);
      setMessage(err.response?.data?.message || 'Profile update failed');
    }
  };

  if (error) return <p className="text-danger text-center mt-5">{error}</p>;
  if (!user) return <p className="text-center mt-5">Loading profile...</p>;

  return (
    <>
    <br />
    <div className="container mt-5 ">
      <h2 className="text-center display-5 fw-bold text-primary mb-4">Hello, {user.fullname} 👋</h2>

      {user.profile?.profilePhoto && (
        <div className="text-center mb-3">
          <img
            src={user.profile.profilePhoto}
            alt="Profile"
            className="shadow"
            style={{
              width: '130px',
              height: '130px',
              objectFit: 'cover',
              borderRadius: '50%',
              border: '3px solid #0d6efd'
            }}
          />
        </div>
        
      )}

      <div className="text-center fs-5 mb-4">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Phone:</strong> {user.phoneNumber}</p>
      </div>

      <div className="text-center mb-4 d-flex justify-content-center gap-3 flex-wrap">
        <button onClick={handleLogout} className="btn btn-outline-danger px-4 shadow">Logout</button>
        <button onClick={() => setIsEditingProfile(!isEditingProfile)} className="btn btn-outline-primary px-4 shadow">
          {isEditingProfile ? 'Cancel Profile Edit' : 'Edit Profile'}
        </button>
        <a
          href="http://localhost:8000/api/v1/user/download-resume"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-success px-4 shadow"
        >
          Download Resume
        </a>
      </div>

      {isEditingProfile && (
        <form onSubmit={handleProfileUpdate} className="card p-4 mb-4 shadow-lg bg-light bg-opacity-75" encType="multipart/form-data">
          <h5 className="text-center mb-3 text-primary">Update Your Profile</h5>
          <input type="text" name="fullname" value={profileData.fullname} onChange={handleProfileChange} className="form-control mb-3" placeholder="Full Name" required />
          <input type="email" name="email" value={profileData.email} onChange={handleProfileChange} className="form-control mb-3" placeholder="Email" required />
          <input type="text" name="phoneNumber" value={profileData.phoneNumber} onChange={handleProfileChange} className="form-control mb-3" placeholder="Phone Number" required />
          <label className="form-label">Upload Profile Photo</label>
          <input type="file" onChange={(e) => setProfilePhoto(e.target.files[0])} className="form-control mb-3" accept="image/*" />
          <label className="form-label">Upload Resume (PDF)</label>
          <input type="file" onChange={(e) => setResume(e.target.files[0])} className="form-control mb-4" accept=".pdf" />
          <button type="submit" className="btn btn-primary w-100 shadow">Save Changes</button>
        </form>
      )}

      {message && <p className="text-center text-success fs-6">{message}</p>}

      <h3 className="mt-5 mb-3 text-center text-dark border-bottom pb-2">🔥 Latest Jobs from Top Recruiters</h3>

      {allJobs.length === 0 ? (
        <p className="text-center text-muted">No jobs available at the moment</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4 mt-2">
          {allJobs.map((job) => (
            <div className="col" key={job._id}>
              <div className="card h-100 border-0 shadow-sm bg-white bg-opacity-75">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-primary">{job.title}</h5>
                  <p className="card-text text-muted">{job.description}</p>
                  <p className="mb-1"><strong>📍 Location:</strong> {job.location}</p>
                  <p className="mb-1"><strong>💰 Salary:</strong> ₹{job.salary}</p>
                  <p className="text-muted mt-auto"><strong>👤 Posted By:</strong> {job.postedBy?.fullname || 'Unknown'}</p>
                </div>
                <div className="card-footer bg-transparent border-0 text-center">
                  <button className="btn btn-outline-primary w-100 shadow-sm">Apply Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>        
  );
};

export default Hello;
