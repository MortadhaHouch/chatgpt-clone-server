let express = require("express");
let userRouter = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const File = require("../models/File")
const jwt = require("jsonwebtoken")
const Message = require("../models/Message");
const Discussion = require("../models/Discussion");
const Workspace = require("../models/Workspace");
require("dotenv").config();
userRouter.get("/preview",async(req,res)=>{
    try {
        const auth = req.headers.authorization;
        if(auth.split(" ").length == 2 && auth.includes("Bearer") && auth[1].trim()!==""){
            const user = await User.findOne({
                clerkId:auth[1]
            });
            if(user){
                let messagesCount = 0;
                let workspacesCount = 0;
                let discussionsCount = 0;
                for await (const element of user.WorkSpaces) {
                    const workspace = await Workspace.findById(element);
                    if(workspace){
                        workspacesCount++;
                        const discussion = await Discussion.findById(element);
                        if(discussion){
                            discussionsCount++;
                            for await (const element of discussion.messages){
                                const message = await Message.findById(element);
                                if(message){
                                    messagesCount++;
                                }
                            }
                        }
                    }
                }
                res.status(200).json({
                    data:{
                        messagesCount,
                        workspacesCount,
                        discussionsCount
                    }
                })
            }else{
                res.status(401).json({
                    message:"Unauthorized"
                })
            }
        }
    } catch (error) {
        console.log(error);
    }
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
                    avatar:avatar.path,
                    isVerified:true,
                    isLoggedIn:true
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
        const {firstName,lastName,avatar,clerkId} = req.body;
        console.log(firstName,lastName,avatar,clerkId);
        const user = await User.findOne({clerkId});
        if(user){
            res.json({clerkId_error:"user with this email already exists"})
        }else{
            const file = await File.create({
                path:avatar
            })
            const createdUser = new User({
                firstName,
                lastName,
                clerkId
            })
            createdUser.avatars.push(file._id);
            await createdUser.save();
            res.json({
                firstName,
                lastName,
                clerkId:createdUser.clerkId
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