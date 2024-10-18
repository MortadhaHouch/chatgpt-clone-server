let express = require("express");
let messageRouter = express.Router();
messageRouter.get("/",(req,res)=>{
    res.status(200).json({
        message:"hello"
    })
})
module.exports = messageRouter;