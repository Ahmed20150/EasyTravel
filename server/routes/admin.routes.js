const express= require("express");
const router = express.Router();
const Admin = require('../models/admin.model');
const TourismGoverner=require('../models/tourismGoverner.model');


//Add Tourism Governer
router.post('/add-tourismGoverner',async(req,res)=>{
    const { username,password }=req.body;

    if (!username||!password){
        return res.status(400).json({message:'Username and Password Required'});
    }

    try{
        const NonUniqueUser=await TourismGoverner.findOne({username});
        if(NonUniqueUser){
        return res.status(400).json({message:'Username already exists'});
        }
        const newTourismGoverner=new TourismGoverner({
            username,
            password
        });
        await TourismGoverner.save();
        res.status(201).json({message:'Tourism Governer Added Successfully'});
    }
    catch(error){
        res.status(500).json({message:'Error Creating new Tourism Governer Account',error});
    }
    });


//Add Admin
router.post('/add-admin',async(req,res)=>{
    const { username,password }=req.body;

    if (!username||!password){
        return res.status(400).json({message:'Username and Password Required'});
    }

    try{
        const NonUniqueUser=await TourismGoverner.findOne({username});
        if(NonUniqueUser){
        return res.status(400).json({message:'Username already exists'});
        }
        const newTourismGoverner=new TourismGoverner({
            username,
            password
        });
        await TourismGoverner.save();
        res.status(201).json({message:'Admin Account Added Successfully'});
    }
    catch(error){
        res.status(500).json({message:'Error Creating new Admin Account',error});
    }
    });


