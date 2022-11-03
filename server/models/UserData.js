const mongoose = require("mongoose");

const UserDataSchema = mongoose.Schema({
    dateOfBirth: {
        type: Date,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    experiences: {
        type: [String],
        required: true
    }
});

module.exports = mongoose.model("UserData", UserDataSchema);