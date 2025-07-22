import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'student',
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setProfilePhoto(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setProfilePhoto(null);
      setPreview(null);
      setMessage('Please select a valid image file');
      setIsSuccess(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (profilePhoto) formData.append('profilePhoto', profilePhoto);

      const res = await axios.post(
        'http://localhost:8000/api/v1/user/register',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setIsSuccess(true);
        setMessage('Signup successful!');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setIsSuccess(false);
        setMessage(res.data.message);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setIsSuccess(false);
      setMessage(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundImage: `url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1920&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          width: '100%',
          padding: '1rem 2rem',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>JobPortal</div>
        <ul style={{ listStyle: 'none', display: 'flex', gap: '1.5rem', margin: 0 }}>
          <li><a href="/" style={{ color: 'white', textDecoration: 'none' }}>Home</a></li>
          <li><a href="/jobs" style={{ color: 'white', textDecoration: 'none' }}>Find Jobs</a></li>
          <li><a href="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</a></li>
        </ul>
      </nav>

      {/* Full-Screen Form Centering */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
        }}
      >
        <div
          className="card shadow-lg p-4"
          style={{
            width: '100%',
            maxWidth: '420px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
          }}
        >
          <h3 className="text-center mb-4" style={{ fontWeight: 600, color: '#003366' }}>
            Create Your Account
          </h3>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <input
              name="fullname"
              className="form-control mb-3"
              placeholder="Full Name"
              value={form.fullname}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              className="form-control mb-3"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              className="form-control mb-3"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <input
              name="phoneNumber"
              className="form-control mb-3"
              placeholder="Phone Number"
              value={form.phoneNumber}
              onChange={handleChange}
              required
            />
            <select
              name="role"
              className="form-control mb-3"
              value={form.role}
              onChange={handleChange}
            >
              <option value="student">Student</option>
              <option value="recruiter">Recruiter</option>
            </select>
            <label className="form-label">Upload Profile Photo</label>
            <input
              type="file"
              name="profilePhoto"
              className="form-control mb-3"
              onChange={handleFileChange}
              accept="image/*"
            />
            {preview && (
              <div className="text-center mb-3">
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #007bff',
                  }}
                />
              </div>
            )}
            <button type="submit" className="btn btn-primary w-100">
              Sign Up
            </button>
          </form>
          {message && (
            <div
              className={`mt-3 text-center fw-semibold ${
                isSuccess ? 'text-success' : 'text-danger'
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;