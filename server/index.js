const express= require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
const Tourist = require("./models/tourist.model.js");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());


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



//Create Tourist
app.post('/api/tourists', async (req, res) => { 
    try {
        const tourist = await Tourist.create(req.body);
        res.status(200).json(tourist);
    } catch (err) {
        res.status(500).json({message: err.message});
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