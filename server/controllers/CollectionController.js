const { Collection, Movie, User } = require("../models");

module.exports = class Controller {
    static async getCollections(req, res, next) {
        try {
            const userId = req.user.id

            const collections = await Collection.findAll({
                include: [Movie, User],
                where: { UserId: userId },
            })

            res.status(200).json(collections)
        } catch (error) {
            console.log("🚀 ~ getCollections ~ error:", error)
            next(error)
        }
    }

    static async deleteCollection(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            // Find the collection
            const collection = await Collection.findByPk(id);

            if (!collection) {
                return next({
                    name: "Not Found",
                    message: "Collection not found",
                });
            }

            // Check if the collection belongs to the user
            if (collection.UserId !== userId) {
                return next({
                    name: "Forbidden",
                    message: "You don't have permission to delete this collection",
                });
            }

            // Delete the collection
            await collection.destroy();

            res.status(200).json({
                message: "Collection deleted successfully",
            });
        } catch (error) {
            console.log("🚀 ~ deleteCollection ~ error:", error);
            next(error);
        }
    }
}
