const mongoose = require("mongoose");

const PointSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    amount: {
        type: Number,
        require: true,
        default: 0.0
    }
});

module.exports = mongoose.model("Point", PointSchema);