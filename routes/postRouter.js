let express = require("express")
let postRouter = express.Router();
let Post = require("../models/Post");
let User = require("../models/User");
let File = require("../models/File");
let JWT = require("jsonwebtoken");
require("dotenv").config();
postRouter.get("/",(req,res)=>{
    res.status(200).json({
        message:"hello"
    })
})
postRouter.post('/',async (req, res) => {
        try {
        } catch (error) {
            console.error('Authentication error:', error);
            res.status(401).json({ message: 'Unauthorized access.' });
        }
    }
);
module.exports = postRouter