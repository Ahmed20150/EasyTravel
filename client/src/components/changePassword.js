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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatNewPassword, setRepeatNewPassword] = useState('');


  const [tokenCookie, setTokenCookie] = useCookies(['token']); // Init cookie object, naming it "token"
  const [loggedInUserCookie, setLoggedInUserCookie] = useCookies(['username']); // Init cookie object, naming it "username"

  const handleSubmit = async (e) => {
    e.preventDefault();

     const username = Cookies.get('username');

     if(newPassword !== repeatNewPassword) {
        toast.error('Passwords do not match!');
         return;
      }

      const user = { username, oldPassword, newPassword };

    try {
      const response = await axios.post('http://localhost:3000/auth/changePassword', user);
      toast.success('Password changed successfully!');
      console.log('Password changed successfully!', response.data);

      // Optionally, update cookies or handle navigation
      setOldPassword('');
      setNewPassword('');
      setRepeatNewPassword('');
      setTimeout(() => {
        navigate("/home");
      }, 2000); 
    } catch (error) {
      const errorMessage = error.response ? error.response.data : error.message;
      toast.error('Error: ' + error.response.data.message);
      console.error('Error:', errorMessage);
    }
  };

  return (
    <CookiesProvider>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <button
        style={{ position: 'absolute', top: '10px', left: '10px' }}
        onClick={() => navigate('/home')}
      >
        Back to Home Page
      </button>
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
              name="oldPassword"
              label="Old Password"
              type="password"
              id="oldPassword"
              onChange={(e) => setOldPassword(e.target.value)}
              autoComplete="password"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="newPassword"
              label="New Password"
              type="password"
              id="newPassword"
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="repeatPassword"
            />
             <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="repeatNewPassword"
              label="Repeat New Password"
              type="password"
              id="repeatNewPassword"
              onChange={(e) => setRepeatNewPassword(e.target.value)}
              autoComplete="newPassword"
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
            {/* <Grid container>
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
            </Grid> */}
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