import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Row, Col, Toast } from 'react-bootstrap';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post(
        'http://localhost:8000/api/v1/user/login',
        { email, password, role },
        { withCredentials: true }
      );

      if (res.data.success) {
        const userRole = res.data.user.role;
        navigate(userRole === 'recruiter' ? '/recruit' : '/hello');
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
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
                  <Form.Label>Email</Form.Label>
                  <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Control
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{
                        borderRadius: '10px',
                        boxShadow: 'inset 0 0 5px rgba(0,0,0,0.06)',
                      }}
                    />
                  </Form.Group>

                  <Form.Group controlId="formPassword" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{
                        borderRadius: '10px',
                        boxShadow: 'inset 0 0 5px rgba(0,0,0,0.06)',
                      }}
                    />
                  </Form.Group>

                  <Form.Group controlId="formRole" className="mb-4">
                    <Form.Label>Role</Form.Label>
                    <Form.Select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      style={{
                        borderRadius: '10px',
                        boxShadow: 'inset 0 0 5px rgba(0,0,0,0.06)',
                      }}
                    >
                      <option value="student">Student</option>
                      <option value="recruiter">Recruiter</option>
                    </Form.Select>
                  </Form.Group>

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