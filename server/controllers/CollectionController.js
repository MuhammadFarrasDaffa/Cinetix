const { Collection } = require("../models");

module.exports = class Controller {
    static async getCollections(req, res, next) {
        try {
            const userId = req.user.id

            const collections = await Collection.findAll({
                where: { UserId: userId },
            })

            res.status(200).json(collections)
        } catch (error) {
            console.log("🚀 ~ getCollections ~ error:", error)
            next(error)
        }
    }
}