let express = require("express");
let app = express();
let cors = require("cors");
let mongoose = require("mongoose");
let bodyParser = require("body-parser");
let db = require("./config/db");
const userRouter = require("./routes/userRouter");
const messageRouter = require("./routes/messageRouter");
db();
const {PORT} = process.env;
app.use(cors({
    credentials:true,
    origin:"http://localhost:3000",
    methods:["GET","POST","PUT","DELETE"]
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/user",userRouter);
app.use("/message",messageRouter);
app.listen(PORT||5000,()=>{
    console.log("server started");
})