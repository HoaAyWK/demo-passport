const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        minLength: 2,
        maxLength: 100,
        required: false
    },
    lastname: {
        type: String,
        minLength: 2,
        maxLength: 100,
        required: false
    },
    email: {
        type: String,
        required: () => this.provider !== "email" ? false : true,
        unique: true
    },
    password: {
        type: String
    },
    gender: {
        type: String,
        default: "Male"
    },
    avatar: {
        type: String,
        required: false
    },
    roles: {
        type: [String], 
        default: ["freelancer"]
    },
    emailConfirmed: {
        type: Boolean,
        default: () => this.provider !== "email" ? true : false
    },
    provider: {
        type: String,
        require: true,
        default: 'email'
    },
    googleId: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);