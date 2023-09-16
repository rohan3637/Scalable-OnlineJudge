import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Grid, Link, Box, Avatar, CssBaseline } from '@mui/material';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
//import { ThemeProvider } from 'react-bootstrap';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const Register = () => {

  const navigate = useNavigate();
  const defaultTheme = createTheme();

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [ formData, setFormData ] = useState({
    username: '',
    email: '',
    password: '' 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can add your registration logic here
    console.log('Form data submitted:', formData);
    axios
      .post(
        "http://localhost:5000/api/auth/register_user", formData
      )
      .then((response) => {
        if (response.status === 201) {
          setSuccessMessage('Registration successful! Redirecting to sign-in...');
          setTimeout(() => {
            navigate('/signin'); // Use navigate for redirection
          }, 1500);
        } else {
          setErrorMessage(response.data.message);
        }  
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container maxWidth="xs">
      <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          {successMessage && (
            <div style={{ textAlign: 'center', color: 'green' }}>{successMessage}</div>
          )}
          {/* Display error message */}
          {errorMessage && (
            <div style={{ textAlign: 'center', color: 'red' }}>{errorMessage}</div>
          )}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Username"
                  variant="outlined"
                  fullWidth
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Password"
                  variant="outlined"
                  fullWidth
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item xs={12} mt={1}>
                <Link href="/signin" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>  
      </Container>
    </ThemeProvider>  
  )
}

export default Register