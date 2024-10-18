let express = require("express");
let userRouter = express.Router();
userRouter.get("/",(req,res)=>{
    res.status(200).json({
        message:"hello"
    })
})
module.exports = userRouter;