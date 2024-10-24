const cloudinary = require("cloudinary").v2;
require("../config/cloudinary");
const apiSecret = cloudinary.config().api_secret;

const signuploadform = () => {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request(
        {
            timestamp: timestamp,
            folder: "asos_chat_app",
        },
        apiSecret
    );

    return { timestamp, signature };
};

module.exports = {
    signuploadform,
};
