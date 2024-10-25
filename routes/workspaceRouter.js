const express = require("express")
const workspaceRouter = express.Router();
workspaceRouter.get("/",async(req,res)=>{
    try {
        const claims = req.headers.authorization;
    } catch (error) {
        console.log(error);
    }
})
module.exports = workspaceRouter;