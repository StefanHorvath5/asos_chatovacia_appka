const User = require("../models/User");
const utils = require("../lib/utils");
const { asyncWrapper } = require("../middleware/async");
const { createCustomError } = require("../errors/customError");

const getUser = asyncWrapper(async (req, res, next) => {
    let user = await User.findOne({ username: res.user.username });
    if (!user) {
        return next(createCustomError(`You have been logged out 1`, 401));
    }

    const tokenObject = utils.issueJWT(user);
    res.status(200).json({
        success: true,
        token: tokenObject.token,
        user: user,
        expiresIn: tokenObject.expires,
    });
});

const login = asyncWrapper(async (req, res, next) => {
    let user = await User.findOne({ username: req.body.username });

    if (!user) {
        return next(createCustomError(`Incorrect credentials 1`, 401));
    }

    const isValid = utils.validPassword(req.body.password, user.hash, user.salt);

    if (isValid) {
        const tokenObject = utils.issueJWT(user);
        res.status(200).json({
            success: true,
            token: tokenObject.token,
            user: user,
            expiresIn: tokenObject.expires,
        });
    } else {
        return next(createCustomError(`Incorrect credentials 2`, 401));
    }
});

const register = asyncWrapper(async (req, res, next) => {
    const saltHash = utils.genPassword(req.body.password);

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = new User({
        username: req.body.username,
        hash: hash,
        salt: salt,
    });
    const user = await newUser.save();
    const jwt = utils.issueJWT(user);
    res.status(200).json({
        success: true,
        token: jwt.token,
        user: user,
        expiresIn: jwt.expires,
    });
});

module.exports = {
    login,
    register,
    getUser,
};
