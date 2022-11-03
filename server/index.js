require("dotenv").config();
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const fs = require("fs");

const db = require("./database/connect");
const authRoute = require("./routes/auth");
const categoriesRoute = require("./routes/categories");
const slugCategoriesRoute = require("./routes/slugCategories");
const User = require("./models/User");
const { authenticate } = require("./middlewares/auth");
const { checkout, webhook } = require("./controllers/checkout");
const { uploadFile } = require("./utils/storage");


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.post('/api/webhook', express.raw({ type: "application/json" }), webhook);
app.use(express.json());
require("./config/passport")(app);

app.use('/api/auth', authRoute);
// app.use('/api/categories', categoriesRoute);
// app.use('/api/slug-categories', slugCategoriesRoute);
app.post('/api/checkout', authenticate, checkout);

app.get('/api/checkout/success', (req, res) => {

    res.status(200).json("success");
});
app.get('/api/checkout/cancel', (req, res) => (res.status(200).json("cancel")));

app.get('/api/test-upload', (req, res) => {
    const file = fs.readFileSync("./image.jps");
    const url = uploadFile(file, "image.jpg");
    res.status(200).json(url);
});

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || 'Something went wrong.';

    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack
    });
});

app.listen(PORT, () => {
    db.connectDB();
    console.log(`Server listening on port ${PORT}`)
});