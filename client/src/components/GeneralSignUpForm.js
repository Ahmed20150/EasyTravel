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
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TouristSignUpForm from './TouristSignUpForm';
import { useNavigate } from "react-router-dom";
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';


const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});


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
  radioGroup: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%', // Adjust the width as needed
  },
  centeredRadio: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    marginLeft: '10px',
  },
}));
//TODO make dropdown for nationality
//TODO put some restrictions on password
  //TODO frontend responses to error and success messages

export default function GeneralSignUpForm() {

  const classes = useStyles();

  //General Data for all User Types
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const[repeatPassword, setRepeatPassword] = useState('')
  const [userType, setUserType] = useState('')

 //Tourist Specific Extra Data
 const [mobileNumber, setMobileNumber] = useState('')
 const [nationality, setNationality] = useState('')
 const [dateOfBirth, setDateOfBirth] = useState('')
 const [occupation, setOccupation] = useState('')

  const handleRadioButtonChange = (event) => {
    const value = event.target.value;
    setUserType(value);
    console.log('Selected Value:', value);
  };


  const navigate = useNavigate();
//submit wihout file upload
  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = {username, email, password, userType}
    
    const tourist = {username, email, password, mobileNumber,nationality,dateOfBirth,occupation,userType};

    console.log(user);
    try {
    if(userType === 'tourist'){
      const response = await axios.post('http://localhost:3000/api/signUp', tourist);
      console.log('Success:', response.data);
    }
    else{
        const response = await axios.post('http://localhost:3000/api/signUp', user);
        console.log('Success:', response.data);
    }

      setUsername('');
      setEmail('');
      setPassword('');
      setUserType('');
      setMobileNumber('');
      setNationality('');
      setDateOfBirth('');
      setOccupation('');

      navigate("/login");

  } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
  }


  // const formData = new FormData();
  // formData.append('myfile',this.state.file);
  // const config = {
  //     headers: {
  //         'content-type': 'multipart/form-data'
  //     }
  // };
  // axios.post("http://localhost:3000/upload",formData,config)
  //     .then((response) => {
  //         alert("The file is successfully uploaded");
  //     }).catch((error) => {
  // });

  }

  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();

    console.log("DOC UPLOAD")
    // if (!selectedFile) {
    //   setUploadStatus('Please select a file to upload.');
    //   return;
    // }

    // const formData = new FormData();
    // formData.append('file', selectedFile);

    // try {
    //   const response = await axios.post('http://localhost:3000/api/upload', formData, {
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //     },
    //   });
    //   setUploadStatus('File uploaded successfully.');
    // } catch (error) {
    //   setUploadStatus('File upload failed.');
    // }
  };


  return (

    
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" style={{ marginBottom: '19px' }}>
          Sign Up
        </Typography>
        <form className={classes.form} action='POST'  onSubmit={handleSubmit}>
        {/* General Info for all Account Types */}
        <FormControl>


      <FormLabel id="demo-row-radio-buttons-group-label">Register As:</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        className={classes.radioGroup}
        value={userType}
        onChange={handleRadioButtonChange}
      >
        <FormControlLabel value="tourGuide" control={<Radio />} label="Tour Guide" />
        <FormControlLabel value="advertiser" control={<Radio />} label="Advertiser" />
        <FormControlLabel value="seller" control={<Radio />} label="Seller" />
        <div className={classes.centeredRadio}>
            <FormControlLabel value="tourist" control={<Radio />} label="Tourist" />
          </div>
      </RadioGroup>
        </FormControl>
          

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
            name="repeatPassword"
            label="Repeat Password"
            type="password"
            id="repeatPassword"
            onChange={(e) => setRepeatPassword(e.target.value)}
            autoComplete="repeatPassword"
          />

          {/* Tourist Specific Sign Up Info */}


          {userType === 'tourist' && (
        <>
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
        </>
      )}

<div>
      <h2>File Upload</h2>
       
      <input
            type="file"
            onChange={handleFileChange}
          />

          {/* <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Confirm Upload
          </Button> */}



    </div>


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