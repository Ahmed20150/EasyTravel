const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
const Tourist = require("./models/tourist.model.js");
const TourismGoverner = require("./models/tourismGoverner.model.js");
const Seller = require("./models/seller.model.js");
const Advertiser = require("./models/advertiser.model.js");
const Admin = require("./models/admin.model.js");
const TourGuide = require("./models/tourGuide.model.js");
const adminRoutes = require('./routes/admin.routes.js');
const authRoutes = require('./routes/authentication.routes.js');
const nodemailer = require("nodemailer");
const generateOtp = require('./generateOTP'); // Import the generateOtp function
const sendEmail = require('./sendEmail');
const upload = require('./middleware/upload');

/////////////////UPLOADING IMPORTS///////////////////////////////////////////////////////
const bodyParser = require('body-parser');
const fileRoutes = require('./routes/file.routes.js');
const Grid = require('gridfs-stream');

// Middleware
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit:'50mb',  extended: true }));
app.use(cors());

require('./config/db');

app.use('/api/files', fileRoutes);
app.use('/auth', authRoutes);



/////////////////////////////////////////////////////////////////////////
//connect admin.routes.js to index.js
app.use('/admin', adminRoutes);
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(cookieParser());


// app.get("/", (req, res) => {
//     res.send("Hello World!");
// });


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// const conn = mongoose.createConnection("mongodb+srv://ahmed1gasser:jxaauvDrMDrxvUQS@acl.05st6.mongodb.net/?retryWrites=true&w=majority&appName=ACL", { useNewUrlParser: true,
//   useUnifiedTopology: true,});

// let gfs;
// conn.once('open', () => {
//   gfs = Grid(conn.db, mongoose.mongo);
//   gfs.collection('uploads');
//   console.log('Connected to GridFS');
// });

//TODO arrange routes in their seperate files, keep index clean
//TODO store sendEmail & generateOTP Files in a folder
//TODO check for repeated emails / usernames


//getting all tourists
app.get('/api/tourists', async (req, res) => {
    try {
        const tourists = await Tourist.find({});
        res.status(200).json(tourists);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
