const ExtractJwt = require("passport-jwt").ExtractJwt;
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const passport = require("passport");

const keys = require("./keys");
const User = require("../models/User");
const Point = require("../models/Point");

const { google } = keys;
const { serverUrl, apiUrl } = keys.app;

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey  = keys.jwt.secret;

passport.use(new JwtStrategy(opts, (payload, done) => {
    User.findById(payload.id)
        .then(user => {
            if (user) {
                return done(null, user);
            }

            return done(null, false);
        })
        .catch(err => {
            return done(err, false);
        });
}));

module.exports = async app => {
    app.use(passport.initialize());

    await googleAuth();
};

const googleAuth = async () => {
    try {
        passport.use(new GoogleStrategy({
            clientID: google.clientID,
            clientSecret: google.clientSecret,
            callbackURL: `${serverUrl}:${keys.port}/${apiUrl}/auth${google.callbackUrl}`
        },
        (accessToken, refreshToken, profile, done) => {
            User.findOne({ email: profile.email })
                .then(user => {
                    if (user) {
                        return done(null, user);
                    }

                    const name = profile.displayName.split(" ");

                    const newUser = new User({
                        provider: "google",
                        googleId: profile.id,
                        email: profile.email,
                        firstname: name[0],
                        lastname: name[1],
                        avatar: profile.picture,
                        password: null
                    });

                    newUser.save((err, user) => {
                        if (err) {
                            return done(err, false);
                        }

                        return done(null, user);
                    });

                    const point = new Point({ user: newUser._id });
                    point.save((err, point) => {
                        if (err) {
                            return done(err, false);
                        }
                    })
                })
                .catch(err => {
                    return done(err, false);
                });
        }))
    } catch (error) {
        console.log("Missing google keys");
    }
};