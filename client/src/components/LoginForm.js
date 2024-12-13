import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import {Button} from "flowbite-react";
import Checkbox from "@material-ui/core/Checkbox";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import axios from "axios";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { buttonStyle, cardStyle, linkStyle, centerVertically, fadeIn,stepStyle, stepIconStyle, stepTitleStyle, stepDescriptionStyle } from "../styles/gasserStyles"; 



function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        EasyTravel
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login() {
  const classes = useStyles();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [tokenCookie, setTokenCookie] = useCookies(["token"]); //init cookie object, naming it "token"
  const [loggedInUserCookie, setloggedInUserCookie] = useCookies(["username"]); //init cookie object, naming it "username"
  const [loggedInUserTypeCookie, setloggedInUserTypeCookie] = useCookies([
    "userType",
  ]); //init cookie object, naming it "userType"
  const [acceptedTermsCookie, setAcceptedTermsCookie] = useCookies([
    "acceptedTerms",
  ]); //init cookie object, naming it "acceptedTerms"
  const [nationalityCookie, setNationalityCookie] = useCookies(["nationality"]); //init cookie object, naming it "acceptedTerms"
  const [occupationCookie, setOccupationCookie] = useCookies(["occupation"]); //init cookie object, naming it "acceptedTerms"

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = { username, password };

    console.log(user);
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        user
      ); //retrieve data from server

      const accessToken = response.data.accessToken; //capture accessToken from response
      const userType = response.data.userType;
      const firstTimeLogin = response.data.firstTimeLogin;
      const acceptedTerms = response.data.acceptedTerms;
      const status = response.data.status;
      const userId = response.data.userId;
      const nationality = response.data.nationality;
      const occupation = response.data.occupation;

      setTokenCookie("token", accessToken, { path: "/", maxAge: 1000 }); // set "token" cookie = accessToken, "path=/" means cookie is accessible from all pages, maxAge = x seconds (amount of time before cookie expires)
      setloggedInUserCookie("username", username, { path: "/", maxAge: 1000 }); // set "username" cookie = username, "path=/" means cookie is accessible from all pages, maxAge = x seconds (amount of time before cookie expires)
      setloggedInUserTypeCookie("userType", userType, {
        path: "/",
        maxAge: 10000,
      }); // set "username" cookie = username, "path=/" means cookie is accessible from all pages, maxAge = x seconds (amount of time before cookie expires)
      setAcceptedTermsCookie("acceptedTerms", acceptedTerms, {
        path: "/",
        maxAge: 10000,
      }); // set "username" cookie = username, "path=/" means cookie is accessible from all pages, maxAge = x seconds (amount of time before cookie expires)
      setOccupationCookie("occupation", occupation, {
        path: "/",
        maxAge: 10000,
      }); // set "occupation" cookie = occupation, "path=/" means cookie is accessible from all pages, maxAge = x seconds (amount of time before cookie expires)
      setNationalityCookie("nationality", nationality, {
        path: "/",
        maxAge: 10000,
      }); // set "occupation" cookie = occupation, "path=/" means cookie is accessible from all pages, maxAge = x seconds (amount of time before cookie expires)

      if (userType === "admin" || userType === "tourismGoverner") {
        toast.success("Successful Login!");
        setTimeout(() => {
          sessionStorage.setItem('fromLogin', 'true');
          navigate("/home", { state: { username } });
        }, 2000);
        return;
      }

      console.log("Successful Login!", response.data);
      console.log("Access Token:", accessToken);
      console.log("Logged in Username:", username);
      console.log("acceptedTerms:", acceptedTerms);

      setUsername("");
      setPassword("");


      console.log("User Type:", userType, "First Time Login:", firstTimeLogin);

      if (status === "rejected") {
        toast.error("Account has been rejected");
        setTimeout(() => {
          navigate("/");
        }, 2000);
        return;
      } else if (status === "pending") {
        toast.error("Account is still pending, Please wait for admin approval");
        // setTimeout(() => {
        //   navigate("/");
        // }, 2000);
        return;
      }

      toast.success("Successful Login!");

      if (firstTimeLogin === false) {
        // forward to home page (add to it view profile page)
        setTimeout(() => {
          sessionStorage.setItem('fromLogin', 'true');
          navigate("/home", { state: { username } });
        }, 2000);
      } else if (firstTimeLogin === true) {
        //forward to terms and conditions page, then create profile, then home page

        if (userType === "tourist") {
          setTimeout(() => {
            sessionStorage.setItem('fromLogin', 'true');
            navigate("/home");
          }, 2000);
        } else {
          setTimeout(() => {
            navigate("/termsAndConditions", { state: { userId, userType } });
          }, 2000);
        }
      }
    } catch (error) {
      toast.error("Invalid Username or Password");
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <ToastContainer />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Button 
          style={{ position: "absolute", top: "10px", left: "10px" }}
          className={buttonStyle}
          onClick={() => navigate("/")}
        >
          ⬅
        </Button>
        <Typography component="h1" variant="h5">
          Log In
        </Typography>
        <form className={classes.form} action="POST" onSubmit={handleSubmit}>
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
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <Button
            type="submit"
            className={`${buttonStyle} w-full`}
          >
            Log in
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/forgotPassword">Forgot password?</Link>
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
