const express=require("express");
const router=express.Router();
const User=require("../models/User");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

const SECRET="mysecretkey";

router.post("/register",async(req,res)=>{
    const {username,email,password}=req.body;
    if(!username||!email||!password){
        return res.json({message:"All Required"});
    }
    const hashedPassword=await bcrypt.hash(password,10);

    const user=new User({
        username,
        email,
        password:hashedPassword
    });
    await user.save();
    res.json({message:"User Registered"});
});
router.post("/login",async(req,res)=>{
    const{email,password}=req.body;
    const user= await User.findOne({email});
    if(!user){
        return res.status(400).json({message:"Please Register"});
    }
    const isMatch=await bcrypt.compare(password,user.password);
    
    if(!isMatch){
        return res.json({message:"Invalid PassWord"});
    }

    const token= jwt.sign(
        {id:user._id},
        SECRET,
        {expiresIn:"1h"}
    );

    res.json({token});
});

module.exports=router;