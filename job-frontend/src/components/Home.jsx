import React from 'react'; 
import { Container, Row, Col, Button, Form, Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();

  const topCompanies = [
    { name: 'Microsoft', logo: 'https://logo.clearbit.com/microsoft.com' },
    { name: 'Google', logo: 'https://logo.clearbit.com/google.com' },
    { name: 'Amazon', logo: 'https://logo.clearbit.com/amazon.com' },
    { name: 'LinkedIn', logo: 'https://logo.clearbit.com/linkedin.com' },
    { name: 'Accenture', logo: 'https://logo.clearbit.com/accenture.com' },
    { name: 'Infosys', logo: 'https://logo.clearbit.com/infosys.com' },
    { name: 'TCS', logo: 'https://logo.clearbit.com/tcs.com' },
    { name: 'IBM', logo: 'https://logo.clearbit.com/ibm.com' },
    { name: 'Wipro', logo: 'https://logo.clearbit.com/wipro.com' },
    { name: 'Capgemini', logo: 'https://logo.clearbit.com/capgemini.com' },
    { name: 'Meta', logo: 'https://logo.clearbit.com/meta.com' }
  ];

  const headerImages = [
    'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
    'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
    'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg'
  ];

  const testimonials = [
    {
      name: 'Aarav Sharma',
      text: 'This portal helped me land my dream job in just two weeks!',
      role: 'Software Engineer at Google',
      image: 'https://randomuser.me/api/portraits/men/75.jpg'
    },
    {
      name: 'Priya Mehta',
      text: 'As a recruiter, I found top talent faster than ever before.',
      role: 'HR Manager at Infosys',
      image: 'https://randomuser.me/api/portraits/women/65.jpg'
    },
    {
      name: 'Rahul Verma',
      text: 'The UI is smooth and the job alerts are super helpful.',
      role: 'Data Analyst at Amazon',
      image: 'https://randomuser.me/api/portraits/men/51.jpg'
    },
    {
      name: 'Sneha Kapoor',
      text: 'Easy to apply and filter jobs. Saved me tons of time!',
      role: 'UI/UX Designer at Microsoft',
      image: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      name: 'Vikram Joshi',
      text: 'Hiring through this platform is efficient and intuitive.',
      role: 'Team Lead at TCS',
      image: 'https://randomuser.me/api/portraits/men/60.jpg'
    }
  ];

  const chunkTestimonials = (arr, size) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );

  const groupedTestimonials = chunkTestimonials(testimonials, 2);

  return (
    <div style={{ backgroundColor: '#f8f9fa', color: '#212529' }} className="min-vh-100 w-100">
      <Carousel fade controls={false} indicators={false} interval={500}>
        {headerImages.map((img, index) => (
          <Carousel.Item key={index}>
            <div
              style={{
                backgroundImage: `url(${img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh',
                width: '100vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Container>
                <Row className="justify-content-center">
                  <Col xl={8}>
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        padding: '40px',
                        borderRadius: '16px',
                        textAlign: 'center',
                        color: '#000',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
                      }}
                    >
                      <h1 className="fw-bold" style={{ fontSize: '3rem', color: '#007BFF' }}>
                        Welcome to Career's Rise
                      </h1>
                      <p className="mb-4" style={{ fontSize: '1.1rem' }}>
                        Your gateway to hiring and getting hired.
                      </p>

                      <div className="d-flex flex-wrap gap-3 justify-content-center mb-3">
                        <Button
                          variant="primary"
                          size="lg"
                          onClick={() => navigate('/signup')}
                          style={{
                            padding: '12px 28px',
                            fontWeight: 600,
                            borderRadius: '8px',
                            boxShadow: '0 4px 14px rgba(0, 123, 255, 0.3)',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
                          onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                        >
                          Get Started
                        </Button>

                        <Button
                          size="lg"
                          onClick={() => navigate('/explore')}
                          style={{
                            padding: '12px 28px',
                            fontWeight: 600,
                            background: '#fff',
                            color: '#007BFF',
                            border: '2px solid #007BFF',
                            borderRadius: '8px',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = '#007BFF';
                            e.target.style.color = '#fff';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = '#fff';
                            e.target.style.color = '#007BFF';
                          }}
                        >
                          Explore Jobs
                        </Button>
                      </div>

                      <Form className="d-flex justify-content-center">
                        <Form.Control
                          type="search"
                          placeholder="Search jobs by title, skill, or company"
                          style={{ maxWidth: '400px' }}
                          className="me-2"
                        />
                        <Button variant="secondary">Search</Button>
                      </Form>
                    </motion.div>
                  </Col>
                </Row>
              </Container>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      <Container fluid className="pt-4 pb-5">
        <h3 className="text-center text-primary mb-4">Top Hiring Companies</h3>
        <Row className="justify-content-center">
          {topCompanies.map((company, index) => (
            <Col xs={6} sm={4} md={2} key={index} className="mb-4 text-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <img
                  src={company.logo}
                  alt={company.name}
                  style={{
                    maxWidth: '100px',
                    maxHeight: '60px',
                    marginBottom: '10px',
                    transition: 'transform 0.3s ease'
                  }}
                />
                <h6>{company.name}</h6>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>

      <Container className="mb-5">
        <h3 className="text-center text-primary mb-4">What People Say</h3>
        <Carousel
          controls={true}
          indicators={false}
          interval={6000}
          nextIcon={<span style={{ fontSize: '2rem', color: '#007BFF' }}>{'>'}</span>}
          prevIcon={<span style={{ fontSize: '2rem', color: '#007BFF' }}>{'<'}</span>}
        >
          {groupedTestimonials.map((group, idx) => (
            <Carousel.Item key={idx}>
              <Row className="justify-content-center">
                {group.map((testimonial, i) => (
                  <Col md={6} key={i} className="mb-4">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.2 }}
                      viewport={{ once: true }}
                      className="p-4 text-center h-100"
                      style={{
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        color: '#000'
                      }}
                    >
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        loading="lazy"
                        className="rounded-circle mb-3"
                        style={{
                          width: '80px',
                          height: '80px',
                          objectFit: 'cover',
                          border: '3px solid #007BFF'
                        }}
                      />
                      <p style={{ fontStyle: 'italic' }}>"{testimonial.text}"</p>
                      <div className="text-warning mb-2">★★★★☆</div>
                      <h5 className="text-primary">{testimonial.name}</h5>
                      <p className="text-muted">{testimonial.role}</p>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>

      <footer className="bg-dark text-light py-4 w-100">
        <Container>
          <Row className="gy-3">
            <Col md={4}>
              <h5>Career's Rise</h5>
              <p>Your trusted destination for top talent and opportunity.</p>
            </Col>
            <Col md={4}>
              <h6>Quick Links</h6>
              <ul className="list-unstyled">
                <li><a href="/signup" className="text-light text-decoration-none">Sign Up</a></li>
                <li><a href="/explore" className="text-light text-decoration-none">Explore Jobs</a></li>
                <li><a href="/login" className="text-light text-decoration-none">Login</a></li>
              </ul>
            </Col>
            <Col md={4}>
              <h6>Contact</h6>
              <p>Email: support@careerrise.com</p>
              <p>Phone: +91-98765-43210</p>
              <p>LinkedIn: <a href="https://linkedin.com/company/jobportal" className="text-light">careerrise</a></p>
              <p>Twitter: <a href="https://twitter.com/jobportal" className="text-light">careerrise</a></p>
            </Col>
          </Row>
          <hr className="border-light mt-3" />
          <p className="text-center mb-0">&copy; {new Date().getFullYear()} Career's Rise. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
};

export default Home;
