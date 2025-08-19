const {default:mongoose}= require('mongoose');
require("dotenv").config();
baseUrl = process.env.BASE_URL;

const connectDB = async()=>{
    try{
        await mongoose.connect(baseUrl);
        console.log("MongoDB connected successfully");
    }
    catch(err){
        console.log(err)
        console.error("MongoDB connection failed:", err.message);
    }
}
module.exports = connectDB