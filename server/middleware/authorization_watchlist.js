const { Watchlist } = require('../models')

module.exports = async function authorization(req, res, next) {
    try {
        const watchlistId = req.user.id
        const watchlist = await Watchlist.findOne({ where: { UserId: watchlistId } })

        if (!watchlist) {
            throw { name: "Not Found", message: "Movies not found" }
        }

        if (watchlist.UserId !== req.user.id) {
            throw { name: "Forbidden", message: "You dont have access" }
        }

        next()
    } catch (error) {
        next(error)
    }
}