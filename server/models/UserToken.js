const mongoose = require("mongoose");

const UserTokenSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    value: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("UserToken", UserTokenSchema);