import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import { Navbar, Button, Card, Footer } from "flowbite-react";
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
import { useNavigate } from "react-router-dom";
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Autocomplete from '@mui/material/Autocomplete';
import countries from '../data/countries';
import { buttonStyle, cardStyle, linkStyle, centerVertically, fadeIn,stepStyle, stepIconStyle, stepTitleStyle, stepDescriptionStyle } from "../styles/gasserStyles"; 

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
        EasyTravel
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
 const [countryCode, setCountryCode] = useState(''); 
 const [nationality, setNationality] = useState('')
 const [dateOfBirth, setDateOfBirth] = useState('')
 const [occupation, setOccupation] = useState('Student')
 const [otherOccupation, setOtherOccupation] = useState(''); 

 const [uploadText, setUploadText] = useState('')

  const handleRadioButtonChange = (event) => {
    const value = event.target.value;
    setUserType(value);
    console.log('Selected Value:', value);
  };


  const navigate = useNavigate();
//submit wihout file upload
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('userType', userType);
    formData.append('repeatPassword', repeatPassword);

    if (file && userType !== 'tourist') {
      formData.append('file', file);
    }

    try {
    if(userType === 'tourist'){
      formData.append('mobileNumber', `${countryCode}${mobileNumber}`);
      formData.append('nationality', nationality);
      formData.append('dateOfBirth', dateOfBirth);
      formData.append('occupation', occupation === 'Other' ? otherOccupation : occupation);
      const response = await axios.post('http://localhost:3000/auth/signUp', formData);
      toast.success('Sign up Successful!');
    }
    else{
      const response = await axios.post('http://localhost:3000/auth/signUp', formData);
      handleUpload();
      toast.success('Sign up Successful!');

    }

      setUsername('');
      setEmail('');
      setPassword('');
      setUserType('');
      setMobileNumber('');
      setCountryCode(''); 
      setNationality('');
      setDateOfBirth('');
      setOccupation('Student');
      setOtherOccupation('');
      setBase64('');
      setFile(null);

      setTimeout(() => {
        navigate("/login");
      }, 2000); 

  } catch (error) {

    toast.error('Sign up Failed: ' + error.response.data.message);
    console.error('Error:', error.response ? error.response.data : error.message);
  }


  }

  //file upload-related code
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [base64, setBase64] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleUpload = async (e) => {
    try {
      const response = await axios.post('http://localhost:3000/api/files/upload', {
        filename: file.name,
        username: username,
        contentType: file.type,
        base64: base64,
      });
      setUploadedFile(response.data.file);
      setUploadText('File uploaded successfully');
    } catch (error) {
      setUploadText('Error uploading file');
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onloadend = () => {
      setBase64(reader.result.split(',')[1]); // Extract base64 string
    };
    reader.readAsDataURL(selectedFile);
  };


  return (
    
    <Container component="main" maxWidth="m">
     
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className="bg-black">
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" style={{ marginBottom: '19px' }}>
          Sign Up
        </Typography>
        <Button
        style={{ position: 'absolute', top: '10px', left: '10px' }}
        className={buttonStyle}
        onClick={() => navigate('/')}
      >
       Back
      </Button>
        <form className={classes.form} action='POST'  onSubmit={handleSubmit}>
        {/* General Info for all Account Types */}
        <FormControl>


      <FormLabel id="demo-row-radio-buttons-group-label" className="justify-center flex">Register As:</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        className="flex-col justify-center"
        value={userType}
        onChange={handleRadioButtonChange}
      >
        <div className={classes.centeredRadio}>
        <FormControlLabel value="tourGuide" control={<Radio />} label="Tour Guide" />
        <FormControlLabel value="advertiser" control={<Radio />} label="Advertiser" />
        </div>
        <div className={classes.centeredRadio}>
        <FormControlLabel value="seller" control={<Radio />} label="Seller" />
            <FormControlLabel value="tourist" control={<Radio />} label="Tourist"/>
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
        <Autocomplete
      id="country-select-demo"
      sx={{ width: 300 }}
      options={countries}
      autoHighlight
      getOptionLabel={(option) => option.label}
      onChange={(event, value) => {
        setNationality(value ? value.label : '');
        setCountryCode(value ? value.phone : ''); 
      }}      renderOption={(props, option) => (
        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
          <img
            loading="lazy"
            width="20"
            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
            alt=""
          />
          {option.label} ({option.code}) +{option.phone}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Choose a country"
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password', // disable autocomplete and autofill
          }}
        />
      )}
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
            value={`${countryCode}${mobileNumber}`}
            onChange={(e) => setMobileNumber(e.target.value.replace(countryCode, ''))}
            autoComplete="mobileNumber"
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
          <FormControl component="fieldset" margin="normal">
          <FormLabel id="demo-row-radio-buttons-group-label">Occupation:</FormLabel>
          <RadioGroup
            aria-label="occupation"
            name="occupation"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
          >
            <FormControlLabel value="Student" control={<Radio />} label="Student" />
            <FormControlLabel value="Other" control={<Radio />} label="Other" />
          </RadioGroup>
        </FormControl>
        {occupation === 'Other' && (
          <TextField
            label="Specify Occupation"
            value={otherOccupation}
            onChange={(e) => setOtherOccupation(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
        )}
        </>
      )}
 {/* File Upload for Non-Tourist Users */}
 {userType !== 'tourist' && (
            <div className="mb-5">
              <h4>File Upload</h4>
              <input type="file" accept="application/pdf" onChange={handleFileChange} required />
              <p>{uploadText}</p>
            </div>
          )}
{/* 
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <Button
            type="submit"
            className={`${buttonStyle} w-full mb-5`}
          >
            Sign Up
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/forgotPassword" variant="body2">
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
      <ToastContainer/>
    </Container>
  );
}