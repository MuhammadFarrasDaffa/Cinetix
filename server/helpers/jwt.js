const jwt = require("jsonwebtoken");

const JWT_KEY = process.env.SECRET_KEY;

function signToken(payload) {
    return jwt.sign(payload, JWT_KEY);
}

function verifyToken(token) {
    return jwt.verify(token, JWT_KEY);
}

module.exports = {
    signToken,
    verifyToken,
};
