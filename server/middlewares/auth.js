const jwt = require("jsonwebtoken");

const { createError } = require('../utils/error');
const { getRoles } = require('../utils/roles');


exports.authorize = (role) => {
    // user must have atleast one role
    if (Array.isArray(role)) {
        const roles = role;
        return ((req, res, next) => {
            const userRoles = getRoles(req.user);

            for (let r of roles) {
                if (userRoles.includes(r)) {
                    console.log(r);
                    return next();
                }
            }

            return next(createError(401, "Unauthorized"));
        });
    }
    // user must have role
    else {
        return ((req, res, next) => {
            const userRoles = getRoles(req.user);

            if (!userRoles.includes(role)) {
                return next(createError(401, "Unauthorized"));
            }

            next();
        });
    }
};


exports.authenticate = (req, res, next) => {
    try {
        const bearerToken = req.headers.authorization;
        
        if (!bearerToken) {
            return next(createError(401, 'You are not authenticated!'));
        }

        const token = bearerToken.split(' ')[1];

        if (!token) {
            return next(createError(401, 'You are not authenticated!'));
        }

        jwt.verify(token, process.env.JWT_KEY, (err, user) => {
            if (err) {
                return next(createError(403, "Invalid token!"));
            }

            req.user = user;
            next();
        });
    } catch (error) {
        next(error);
    }
};