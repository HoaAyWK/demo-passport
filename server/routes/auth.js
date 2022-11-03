const { Router } = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const { login, register, confirmEmail } = require('../controllers/auth');

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/email-confirmation/:id/:token', confirmEmail);
router.get('/google', passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
    accessType: "offline",
    approvalPrompt: "force"
}));
router.get('/google/callback', passport.authenticate("google", {
    failureRedirect: "/login",
    session: false
}), (req, res) => {
    const payload = {
        id: req.user.id
    };

    const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "6h"})
    res.status(200).json(token);
});

module.exports = router;