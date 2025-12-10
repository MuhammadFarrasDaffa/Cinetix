const { Watchlist } = require('../models')

module.exports = async function authorization(req, res, next) {
    try {
        const watchlistId = req.params.id
        const watchlist = await Watchlist.findByPk(watchlistId)

        if (!watchlist) {
            throw { name: "Not Found", message: "Transportation not found" }
        }

        if (watchlist.UserId !== req.user.id) {
            throw { name: "Forbidden", message: "You dont have access" }
        }

        next()
    } catch (error) {
        next(error)
    }
}