const mongoose = require("mongoose");

const SlugCategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: false
    },
    slug: {
        type: String,
        require: true,
        unique: true
    }
});

module.exports = mongoose.model("SlugCategory", SlugCategorySchema);