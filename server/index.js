const express= require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
const Tourist = require("./models/tourist.model.js");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(cookieParser());


app.get("/", (req, res) => {
    res.send("Hello World!");
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

mongoose.connect("mongodb+srv://ahmed1gasser:jxaauvDrMDrxvUQS@acl.05st6.mongodb.net/?retryWrites=true&w=majority&appName=ACL").then(() =>{
    console.log("Connected to the database!");
}).catch((err) => {
    console.log("Cannot connect to the database!", err);
});



//Create Tourist (Sign up)
app.post('/api/signUp', async (req, res) => { 
    try {
        const tourist = await Tourist.create(req.body);
        res.status(200).json(tourist);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

// Login for Tourist
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const tourist = await Tourist.findOne({ username });

        if (!tourist) {
            return res.status(400).json({ message: "username doesnt exist" });
        }

        const isPasswordValid = password==tourist.password;

        

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password, Tourist pw is "+ tourist.password + " while your password is " + password });
        }

         //create JWT
        const accessToken = jwt
        .sign(
            {
                id: tourist._id,
            },
            "secret",
            { expiresIn: "1d" }
        );

        res.status(200).json({ message: "Login successful", tourist, accessToken: accessToken });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//getting all tourists
app.get('/api/tourists', async (req, res) => { 
    try {
        const tourists = await Tourist.find({});
        res.status(200).json(tourists);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});