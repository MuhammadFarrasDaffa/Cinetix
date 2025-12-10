const { Profile } = require('../models')

module.exports = async function authorization(req, res, next) {
    try {
        const profileId = req.params.id
        const profile = await Profile.findByPk(profileId)

        if (!profile) {
            throw { name: "Not Found", message: "Transportation not found" }
        }

        if (profile.UserId !== req.user.id) {
            throw { name: "Forbidden", message: "You dont have access" }
        }

        next()
    } catch (error) {
        next(error)
    }
}