const mongoose = require("mongoose");

const connectDB = () => {
    try{
        mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to Database");
    }
    catch(error){
        console.log(error.message)
    }
};

module.exports = { connectDB };