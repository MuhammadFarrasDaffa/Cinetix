const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

module.exports = async function authentication(req, res, next) {
    if (!req.headers.authorization) {
        next({ name: "Unauthorized", message: "You need login first!" });
        return;
    }

    const token = req.headers.authorization.split(" ")[1];

    try {
        const data = verifyToken(token);

        const user = await User.findByPk(data.id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            throw ({ name: "Unauthorized", message: "Invalid Token" });
        }

        // Assign value for authorization
        req.user = user;

        next();
    } catch (error) {
        console.log("🚀 ~ authentication ~ error:", error);
        next(error);
    }
};
