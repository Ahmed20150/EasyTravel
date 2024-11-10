import React from 'react';
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
import {useState} from 'react';
import axios from 'axios';
import { CookiesProvider, useCookies } from 'react-cookie'
import { useNavigate } from "react-router-dom";
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



export default function ForgotPasswordForm() {
  const classes = useStyles();

  const [email, setEmail] = useState('')
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [otp, setOTP] = useState('')
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('')

  const [tokenCookie, setTokenCookie] = useCookies(['token']) //init cookie object, naming it "token"
  const [loggedInUserCookie, setloggedInUserCookie] = useCookies(['username']) //init cookie object, naming it "username"
  const [loggedInUserTypeCookie, setloggedInUserTypeCookie] = useCookies(['userType']) //init cookie object, naming it "userType"



  const navigate = useNavigate();


  const handleSendEmail = async (e) => {
    e.preventDefault();
    try{
        const response = await axios.post('http://localhost:3000/auth/forgotPassword', {email});
        console.log(response);
        setShowOtpForm(true);
    } 
  catch (error) {
    toast.error('Error: ' + error.response.data.message);
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}


const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try{
        const response = await axios.post('http://localhost:3000/auth/verifyOtp', {email, otp});
        console.log(response);
        setShowChangePasswordForm(true);

    } 
  catch (error) {
    toast.error('Error: ' + error.response.data.message);
      console.error('Error:', error.response ? error.response.data : error.message);
  }
}


const handleChangePassword = async () => {
    try {
      if(repeatPassword !== newPassword) {
        toast.error('Passwords do not match!');
        return;
      }
      await axios.post('http://localhost:3000/auth/changeForgotPassword', { email, newPassword });
      toast.success('Password changed successfully');
      setTimeout(() => {
        navigate("/login");
      }, 2000);    } catch (error) {
      toast.error('Failed to change password: ' + error.response.data.message);
      console.error('Failed to change password:', error);
    }
  };
 

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <button
        style={{ position: 'absolute', top: '10px', left: '10px' }}
        onClick={() => navigate('/')}
      >
        Back to Landing Page
      </button>
        <Typography component="h1" variant="h5">
          Forget Password
        </Typography>

        <Typography component="h3" variant="h7">
          Please enter Email associated with your account
        </Typography>

        <Typography component="h3" variant="h8">
         We will send a One Time Password (OTP) to this associated email
        </Typography>
        {!showOtpForm && !showChangePasswordForm ? (
          <form>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSendEmail}
            >
              Send Email
            </Button>
          </form>
        ) : showOtpForm && !showChangePasswordForm ? (
          <form>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="otp"
              label="OTP"
              name="otp"
              autoComplete="otp"
              autoFocus
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleVerifyOtp}
            >
              Verify OTP
            </Button>
          </form>
        ) : (
          <form>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="newPassword"
              label="New Password"
              name="newPassword"
              type="password"
              autoComplete="newPassword"
              autoFocus
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="repeatPassword"
              label="Repeat New Password"
              name="repeatNewPassword"
              type="password"
              autoComplete="repeatNewPassword"
              autoFocus
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleChangePassword}
            >
              Change Password
            </Button>
          </form>
        )}
          <Grid container>
  
            <Grid item >
              <Link href="/signUp" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}