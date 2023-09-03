import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Col, Row } from 'react-bootstrap';

// Create a CSS class to set the height to 80% of the viewport height
const containerStyle = {
  minHeight: '80vh',
};

const AddQuestion = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'MEDIUM',
    hints: '',
    topic: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to your backend API to add the question
      await axios.post('http://localhost:5000/api/question/add_question', formData);

      // Reset the form after a successful submission
      setFormData({
        title: '',
        description: '',
        difficulty: 'MEDIUM',
        hints: '',
        topic: '',
      });

      alert('Question added successfully!');
    } catch (error) {
      console.error('Error adding question:', error);
      alert('Failed to add question. Please try again.');
    }
  };

  return (
    <Container className="bg-dark text-white" style={containerStyle}>
      <h2 className="text-center mt-3">Add Question</h2>
      <Row className="justify-content-center">
        <Col md={6}>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Topic</Form.Label>
              <Form.Control
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Difficulty</Form.Label>
              <Form.Control
                as="select"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </Form.Control>
            </Form.Group>

            <Button type="submit" className="btn-success">Add Question</Button>
          </Form>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Hints</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="hints"
              value={formData.hints}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>
    </Container>
  );
};

export default AddQuestion;



