let express = require("express");
let messageRouter = express.Router();
const User = require("../models/Message");
const Discussion = require("../models/Discussion");
const Message = require("../models/Message");
require("dotenv").config();
const {clerkMiddleware} = require("@clerk/express");
messageRouter.use(clerkMiddleware({
    signInUrl:"/login",
    signUpUrl:"/signup"
}))
messageRouter.get("/:id",async(req,res)=>{
    const {id} = req.params;
    const discussion = await Discussion.findById(id);
    if(discussion){
        const auth = req.headers.authorization.split(" ");
        if(auth.length == 2 && auth.includes("Bearer") && auth[1].trim() !== ""){
            const userId = auth[1]
            const sender = await User.findById(userId);
            if(sender){
                const messages = [];
                for await (const item of discussion.messages) {
                    const message = await Message.findById(item);
                    if(message){
                        messages.push({
                            content:message.content,
                            isMine:message.from.toString() == sender._id.toString()
                        })
                    }
                }
                res.status(200).json({messages});
            }
        }
    }
    res.status(200).json({
        message:"hello"
    })
})
messageRouter.post("/add/:id",async(req,res)=>{
    try {
        const {id} = req.params;
        const discussion = await Discussion.findById(id);
        const auth = req.headers.authorization;
        if(auth.split(" ").length == 2 && auth.includes("Bearer") && auth[1].trim()!==""){
            const user = await User.findById(auth[1]);
            if(user){
                if(discussion){
                    const {content} = req.body;
                    const message = await Message.create({
                        content,
                        from
                    })
                    discussion.messages.push(message._id);
                    await discussion.save();
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
})
module.exports = messageRouter;