import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from 'axios';
import { CookiesProvider, useCookies } from 'react-cookie';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function ChangePassword() {
  const classes = useStyles();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');


  const [tokenCookie, setTokenCookie] = useCookies(['token']); // Init cookie object, naming it "token"
  const [loggedInUserCookie, setLoggedInUserCookie] = useCookies(['username']); // Init cookie object, naming it "username"

  const handleSubmit = async (e) => {
    e.preventDefault();

     const username = Cookies.get('username');

     if(password !== repeatPassword) {
        alert('Passwords do not match!');
         return;
      }

      const user = { username, password, newPassword };

    try {
      const response = await axios.post('http://localhost:3000/api/changePassword', user);
      console.log('Password changed successfully!', response.data);

      // Optionally, update cookies or handle navigation
      setPassword('');
      setRepeatPassword('');
      navigate('/home');
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  //TODO frontend responses to error and success messages
  return (
    <CookiesProvider>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Change Password
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            {/* <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
            /> */}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="password"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="repeatPassword"
              label="Repeat Password"
              type="repeatPassword"
              id="repeatPassword"
              onChange={(e) => setRepeatPassword(e.target.value)}
              autoComplete="repeatPassword"
            />
             <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="newPassword"
              label="New Password"
              type="newPassword"
              id="newPassword"
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="newPassword"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Change Password
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signUp" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </CookiesProvider>
  );
}

export default ChangePassword;