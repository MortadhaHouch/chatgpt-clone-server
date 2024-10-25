let express = require("express");
let userRouter = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const File = require("../models/File")
const jwt = require("jsonwebtoken")
require("dotenv").config();
userRouter.get("/",(req,res)=>{
    res.status(200).json({
        message:"hello"
    })
})
userRouter.post("/login",async(req,res)=>{
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(user){
            const isMatch = await bcrypt.compare(password,user.password);
            if(isMatch){
                const avatar = await File.findById(user.avatars[0]);
                res.status(200).json({
                    email:user.email,
                    firstName:user.firstName,
                    lastName:user.lastName,
                    avatar:avatar.path
                })
            }else{
                res.status(401).json({
                    message:"Invalid Credentials"
                })
            }
        } 
    } catch (error) {
        console.log(error);
    }
})
userRouter.post("/signup",async(req,res)=>{
    try {
        const {firstName,lastName,email,password,avatar} = req.body;
        const user = await User.findOne({email});
        if(user){
            res.json({email_error:"user with this email already exists"})
        }else{
            const file = await File.create({
                path:avatar
            })
            const createdUser = new User({
                firstName,
                lastName,
                email,
                password
            })
            createdUser.avatars.push(file._id);
            await createdUser.save();
            res.json({
                firstName,
                lastName,
                email,
                password
            })
        }
    } catch (error) {
        console.log(error);
    }
})
userRouter.put("/logout",async(req,res)=>{
    try {
        if(req.cookies.jwt_auth){
            const {email} = jwt.verify(req.cookies.jwt_auth,process.env.SECRET_KEY);
            const user = await User.findOne({email});
            if(user){
                user.isLoggedIn = false;
                await user.save();
            }
        }else{
            res.json({error:"Bad request"})
        }
    } catch (error) {
        console.log(error);
    }
})
module.exports = userRouter;