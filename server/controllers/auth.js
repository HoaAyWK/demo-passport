const { hash, compare } = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { randomBytes } = require("crypto");

const { createError } = require('../utils/error');
const constants = require("../lib/constants");
const User = require("../models/User");
const UserToken = require("../models/UserToken");
const Point = require("../models/Point");

exports.register = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(createError(400, "Email and Password are required."));
    }

    try {
        const emailExist = await User.findOne({ email }).lean();

        if (emailExist) {
            return next(createError(400, "Email already in use."));
        }

        const hashedPassword = await hash(password, 12);
        const newUser = new User ({
            ...req.body,
            password: hashedPassword
        });

        await newUser.save();

        const userToken = new UserToken({ user: newUser._id, value: randomBytes(32).toString('hex')});
        await userToken.save();

        const point = new Point({ user: newUser._id });
        await point.save();

        const transporter = nodemailer.createTransport({
            service: process.env.SERVICE,
            host: process.env.HOST,
            port: process.env.HOST_PORT,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Confirm Your Email",
            html: `
                <div>
                    <h3>Please clicking the link bellow to confirm your email</h3>
                    <a href="${req.protocol}://${req.get('host')}/api/auth/email-confirmation/${newUser._id}/${userToken.value}">Confirm Email</a>
                </div>       `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json("An email has been sent to your email.");

        // return res.status(201).json("User has been created!");
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return next(createError(400, "Email and Password are required."));
    }

    try {
        const user = await User.findOne({ email }).lean();
        if (!user) {
            return next(createError(404, "User not found!"));
        }

        const isMatch = await compare(password, user.password);
        
        if (!isMatch) {
            return next(createError(400, "Invalid credentials!"));
        }

        let payload = {
            userId: user._id,
            email,
            isAdmin: false,
            isEmployer: false,
            isFreelancer: false
        };

        if (user.roles.includes(constants.ADMIN)) {
            payload.isAdmin = true;
        }

        if (user.roles.includes(constants.EMPLOYER)) {
            payload.isEmployer = true;
        }

        if (user.roles.includes(constants.FREELANCER)) {
            payload.isFreelancer = true;
        }

        const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "6h"});
        const { password: hashedPassword, roles, ...ortherDetails } = user;
        
        return res.status(200).json({ token, user: ortherDetails });
    } catch (error) {
        next(error);
    }
};


exports.confirmEmail = async (req, res, next) => {
    const { id, token } = req.params;

    try {
        const user = await User.findById(id);

        if (!user) {
            return next(createError(404, "We are unable to find your account for this verification. Please register!"));
        }

        const userToken = await UserToken.findOne({ user: id, value: token });

        if (!userToken) {
            return next(createError(400, "Your verification link has been expired."));
        } else if (user.emailConfirmed) {
            return res.status(200).json("Account has been already verified. Please login!")
        } else {
            user.emailConfirmed = true;
            await user.save();
            await UserToken.findByIdAndRemove(userToken._id);

            return res.status(200).json("Email has been verified.");
        }
    } catch (error) {
        next(error);
    }
};