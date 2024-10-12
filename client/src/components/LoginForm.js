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


//TODO frontend responses to error and success messages

export default function Login() {
  const classes = useStyles();

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [tokenCookie, setTokenCookie] = useCookies(['token']) //init cookie object, naming it "token"
  const [loggedInUserCookie, setloggedInUserCookie] = useCookies(['username']) //init cookie object, naming it "username"
  const [loggedInUserTypeCookie, setloggedInUserTypeCookie] = useCookies(['userType']) //init cookie object, naming it "userType"



  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = {username,password}

    console.log(user);
    try {
      const response = await axios.post('http://localhost:3000/api/login', user); //retrieve data from server
      const accessToken = response.data.accessToken; //capture accessToken from response
      const userType = response.data.userType;
      console.log('Successful Login!', response.data);
      console.log('Access Token:', accessToken);
      console.log('Logged in Username:', username);

      setTokenCookie('token', accessToken, { path: '/', maxAge: 1000 }); // set "token" cookie = accessToken, "path=/" means cookie is accessible from all pages, maxAge = x seconds (amount of time before cookie expires) 
      setloggedInUserCookie('username', username, { path: '/', maxAge: 1000 }); // set "username" cookie = username, "path=/" means cookie is accessible from all pages, maxAge = x seconds (amount of time before cookie expires) 
      setloggedInUserTypeCookie('userType', userType, { path: '/', maxAge: 1000 }); // set "username" cookie = username, "path=/" means cookie is accessible from all pages, maxAge = x seconds (amount of time before cookie expires) 


      setUsername('');
      setPassword('');

      //TODO based on userType navigate to different pages
      navigate('/home');


  } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
  }




  }



  

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Log In
        </Typography>
        <form className={classes.form} action='POST' onSubmit={handleSubmit}>
        <TextField
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
          />
        
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
            Log in
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href='/forgotPasswordForm'>
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
  );
}