import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/v1/user/check-auth', {
          withCredentials: true,
        });
        if (res.data.success) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const hideLogin = ['/hello', '/recruit', '/login'].includes(currentPath);
  const hideSignup = ['/hello', '/recruit', '/signup'].includes(currentPath);
  const hideExplore = ['/hello', '/recruit'].includes(currentPath);

  return (
    <Navbar
      expand="lg"
      fixed="top"
      style={{
        background: 'linear-gradient(to right, #007BFF, #00BFFF)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        zIndex: 1000,
        transition: 'all 0.3s ease-in-out'
      }}
    >
      <Container fluid>
        <Navbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center"
          style={{
            fontWeight: 'bold',
            color: '#fff',
            fontSize: '1.4rem',
            letterSpacing: '1px',
            transition: '0.3s'
          }}
          onMouseEnter={(e) => (e.target.style.color = '#FFD700')}
          onMouseLeave={(e) => (e.target.style.color = '#fff')}
        >
          <img
            src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&h=60"
            alt="Career Rise Logo"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              marginRight: '10px',
              objectFit: 'cover',
              border: '2px solid #fff',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
            }}
          />
          Career's Rise
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-content" style={{ backgroundColor: '#fff' }} />

        <Navbar.Collapse id="navbar-content">
          <Nav className="ms-auto align-items-center">
            {!hideExplore && (
              <Nav.Link
                as={Link}
                to="/explore"
                style={linkStyle}
                onMouseEnter={(e) => (e.target.style.color = '#FFD700')}
                onMouseLeave={(e) => (e.target.style.color = '#fff')}
              >
                Find Jobs
              </Nav.Link>
            )}

            {!isLoggedIn ? (
              <>
                {!hideLogin && (
                  <Nav.Link
                    as={Link}
                    to="/login"
                    style={linkStyle}
                    onMouseEnter={(e) => (e.target.style.color = '#FFD700')}
                    onMouseLeave={(e) => (e.target.style.color = '#fff')}
                  >
                    Login
                  </Nav.Link>
                )}

                {!hideSignup && (
                  <Button
                    as={Link}
                    to="/signup"
                    variant="light"
                    size="sm"
                    style={buttonStyle}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#007BFF';
                      e.target.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#fff';
                      e.target.style.color = '#007BFF';
                    }}
                  >
                    Sign Up
                  </Button>
                )}
              </>
            ) : (
              <>
                <Nav.Link
                  as={Link}
                  to="/edit-profile"
                  style={linkStyle}
                  onMouseEnter={(e) => (e.target.style.color = '#FFD700')}
                  onMouseLeave={(e) => (e.target.style.color = '#fff')}
                >
                  Edit Profile
                </Nav.Link>

                <Button
                  onClick={handleLogout}
                  variant="light"
                  size="sm"
                  style={buttonStyle}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#007BFF';
                    e.target.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#fff';
                    e.target.style.color = '#007BFF';
                  }}
                >
                  Logout
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

const linkStyle = {
  color: '#fff',
  marginRight: '20px',
  fontWeight: 500,
  transition: '0.3s ease'
};

const buttonStyle = {
  fontWeight: 600,
  borderRadius: '20px',
  padding: '8px 20px',
  background: '#fff',
  color: '#007BFF',
  transition: 'all 0.3s ease',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  border: 'none'
};

export default NavBar;