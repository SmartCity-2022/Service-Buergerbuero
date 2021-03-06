require("dotenv").config();
const { verify } = require("jsonwebtoken");

function verify_jwt(jwt) {
    try {
        const decoded = verify(jwt, process.env.JWT_SECRET);
        return { payload: decoded, expired: false };
    } catch (error) {
        if (!error.message.includes("jwt expired")) {
            console.error(error);
        }
        return {
            payload: null,
            expired: error.message.includes("jwt expired"),
        };
    }
}

module.exports = { verify_jwt };
