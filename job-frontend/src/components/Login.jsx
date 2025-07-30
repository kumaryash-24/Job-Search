import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequest, loginSuccess, loginFailure } from '../redux/authSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // ---> CHANGE #1: We no longer need the role state here. The backend will determine it.
  // const [role, setRole] = useState('student'); 
  const { error } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginRequest());

    try {
      // ---> CHANGE #2: Remove role from the data sent to the backend.
      const res = await axios.post(
        'http://localhost:8000/api/v1/user/login',
        { email, password }, // Role is no longer sent
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success('Login Successful!'); 
        dispatch(loginSuccess(res.data.user));
        
        // ---> CHANGE #3: Add navigation logic for the admin role.
        const userRole = res.data.user.role;
        
        setTimeout(() => {
          if (userRole === 'admin') {
            navigate('/admin/dashboard');
          } else if (userRole === 'recruiter') {
            navigate('/recruit');
          } else {
            navigate('/hello');
          }
        }, 1500); // 1.5-second delay to show the toast message

      } else {
        toast.error(res.data.message || 'An unknown error occurred.');
        dispatch(loginFailure(res.data.message));
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
      dispatch(loginFailure(errorMessage));
    }
  };

  const backgroundImage = 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1080';

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: '120px',
        overflowX: 'hidden',
      }}
    >
     
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={8} md={6}>
            <Card
              className="shadow-lg border-0"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.92)',
                borderRadius: '16px',
                backdropFilter: 'blur(8px)',
                padding: '30px',
              }}
            >
              <Card.Body>
                <h3
                  className="text-center mb-4"
                  style={{
                    color: '#007BFF',
                    fontWeight: '700',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                  }}
                >
                  Login
                </h3>
                <Form onSubmit={handleLogin}>
                  <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{
                        borderRadius: '10px',
                        boxShadow: 'inset 0 0 5px rgba(0,0,0,0.06)',
                      }}
                    />
                  </Form.Group>

                  <Form.Group controlId="formPassword" className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{
                        borderRadius: '10px',
                        boxShadow: 'inset 0 0 5px rgba(0,0,0,0.06)',
                      }}
                    />
                  </Form.Group>

                  {/* ---> CHANGE #4: The role selection dropdown is now removed from the form. <--- */}

                  <div className="d-grid">
                    <Button
                      type="submit"
                      variant="primary"
                      style={{
                        fontWeight: '600',
                        borderRadius: '10px',
                        boxShadow: '0 0 10px rgba(0,123,255,0.5)',
                        transition: 'transform 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.target.style.transform = 'scale(1.03)')}
                      onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                    >
                      Login
                    </Button>
                  </div>
                </Form>

                {error && (
                  <p className="text-danger text-center mt-3 fw-semibold">
                    {error}
                  </p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;