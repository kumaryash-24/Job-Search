import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';

const Explore = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filters, setFilters] = useState({ title: '', location: '' });
  const navigate = useNavigate();

  const dummyJobs = [
    {
      _id: 'd1',
      title: 'Frontend Developer',
      description: 'React-based UI development',
      location: 'Bengaluru',
      salary: 60000,
      postedBy: { fullname: 'Demo Recruiter' },
    },
    {
      _id: 'd2',
      title: 'Backend Developer',
      description: 'Node.js API and database integration',
      location: 'Delhi',
      salary: 70000,
      postedBy: { fullname: 'Demo Recruiter' },
    },
    {
      _id: 'd3',
      title: 'UI/UX Designer',
      description: 'Figma & Adobe design systems',
      location: 'Mumbai',
      salary: 55000,
      postedBy: { fullname: 'Demo Recruiter' },
    },
    {
      _id: 'd4',
      title: 'Data Analyst',
      description: 'Analyze business trends with SQL',
      location: 'Remote',
      salary: 65000,
      postedBy: { fullname: 'Demo Recruiter' },
    },
    {
      _id: 'd5',
      title: 'Project Manager',
      description: 'Oversee teams and deliverables',
      location: 'Hyderabad',
      salary: 90000,
      postedBy: { fullname: 'Demo Recruiter' },
    },
  ];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/v1/jobs');
        const realJobs = res.data.success ? res.data.jobs : [];
        const allJobs = [...dummyJobs, ...realJobs];
        setJobs(allJobs);
        setFilteredJobs(allJobs);
      } catch (err) {
        console.error('Failed to load jobs:', err);
        setJobs(dummyJobs);
        setFilteredJobs(dummyJobs);
      }
    };

    fetchJobs();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    const updated = jobs.filter((job) => {
      const titleMatch = job.title.toLowerCase().includes(filters.title.toLowerCase());
      const locationMatch = job.location.toLowerCase().includes(filters.location.toLowerCase());
      return titleMatch && locationMatch;
    });

    setFilteredJobs(updated);
  };

  const handleClear = () => {
    setFilters({ title: '', location: '' });
    setFilteredJobs(jobs);
  };

  return (
    <div
      style={{
        background: 'linear-gradient(to right, #e3f2fd, #e8f5e9)',
        minHeight: '100vh',
        width: '100vw',
        paddingTop: '100px',
        paddingBottom: '40px',
      }}
    >
      <Container fluid="xl">
        <h2
          className="text-center mb-4"
          style={{
            fontWeight: '700',
            fontSize: '2.5rem',
            color: '#007BFF',
            textShadow: '1px 1px 1px rgba(0,0,0,0.1)',
          }}
        >
          Explore Jobs 🔍
        </h2>
        <Row>
          {/* Sidebar Filter */}
          <Col md={3}>
            <div
              className="p-4 shadow"
              style={{
                background: 'rgba(255, 255, 255, 0.85)',
                borderRadius: '16px',
                backdropFilter: 'blur(6px)',
                position: 'sticky',
                top: '100px',
              }}
            >
              <h5 className="text-dark mb-4" style={{ fontWeight: '600' }}>Filter Jobs</h5>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    placeholder="Search by title"
                    value={filters.title}
                    onChange={handleFilterChange}
                    style={{ boxShadow: 'none', borderRadius: '8px' }}
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    placeholder="Search by location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    style={{ boxShadow: 'none', borderRadius: '8px' }}
                  />
                </Form.Group>
                <div className="d-flex gap-3">
                  <Button variant="primary" className="w-50" onClick={handleSearch}>
                    Search
                  </Button>
                  <Button variant="outline-dark" className="w-50" onClick={handleClear}>
                    Clear
                  </Button>
                </div>
              </Form>
            </div>
          </Col>

          {/* Jobs Grid */}
          <Col md={9}>
            {filteredJobs.length === 0 ? (
              <p className="text-center text-muted mt-4">No matching jobs found.</p>
            ) : (
              <Row xs={1} sm={2} md={2} lg={2} className="g-4">
                {filteredJobs.map((job) => (
                  <Col key={job._id}>
                    <Card
                      className="h-100 shadow border-0"
                      style={{
                        borderRadius: '16px',
                        transition: 'transform 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0px)';
                      }}
                    >
                      <Card.Body style={{ paddingBottom: 0 }}>
                        <Card.Title className="text-info" style={{ fontWeight: '600' }}>{job.title}</Card.Title>
                        <Card.Text style={{ fontSize: '0.95rem' }}>
                          <strong>Description:</strong> {job.description}
                          <br />
                          <strong>Location:</strong> {job.location}
                          <br />
                          <strong>Salary:</strong> ₹{job.salary}
                          <br />
                          <strong>Posted By:</strong> {job.postedBy?.fullname}
                        </Card.Text>
                      </Card.Body>
                      <Card.Footer className="bg-transparent border-0 text-center">
                        <Button
                          variant="outline-primary"
                          style={{ borderRadius: '8px' }}
                          onClick={() => navigate('/login')}
                        >
                          Apply Now
                        </Button>
                      </Card.Footer>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Explore;