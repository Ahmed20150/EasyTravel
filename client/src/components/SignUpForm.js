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
//TODO make dropdown for nationality
//TODO put some restrictions on password
  //TODO frontend responses to error and success messages

export default function SignUp() {
  const classes = useStyles();

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [nationality, setNationality] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [occupation, setOccupation] = useState('')


  const handleSubmit = async (e) => {
    e.preventDefault();

    const tourist = {username, email, password, mobileNumber,nationality,dateOfBirth,occupation};

    console.log(tourist);
    try {
      const response = await axios.post('http://localhost:3000/api/signUp', tourist);
      console.log('Success:', response.data);

      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setMobileNumber('');
      setNationality('');
      setDateOfBirth('');
      setOccupation('');
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
          Sign Up
        </Typography>
        <form className={classes.form} action='POST'  onSubmit={handleSubmit}>
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
            id="email"
            label="Email Address"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
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

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="confirmPassword"
          />

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="mobileNumber"
            label="Mobile Number"
            type="number"
            id="mobileNumber"
            onChange={(e) => setMobileNumber(e.target.value)}
            autoComplete="mobileNumber"
          />

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="nationality"
            label="Nationality"
            type="text"
            id="nationality"
            onChange={(e) => setNationality(e.target.value)}
            autoComplete="nationality"
          />    

          <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="dateOfBirth"
          label="Date of Birth"
          type="date"
          id="dateOfBirth"
          onChange={(e) => setDateOfBirth(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          autoComplete="DOB"
        />  


        
          <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="occupation"
          label="Occupation"
          type="text"
          id="occupation"
          onChange={(e) => setOccupation(e.target.value)}
          autoComplete="occupation"
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
            Sign Up
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/Login" variant="body2">
                {"have an account? Log In"}
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