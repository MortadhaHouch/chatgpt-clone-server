let mongoose = require('mongoose')
require("dotenv").config();
export default async function connectToDb(){
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("connected to db");
    } catch (error) {
        console.log(error);
    }
}