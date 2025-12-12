const { Profile } = require("../models");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

module.exports = class Controller {
    static async getProfiles(req, res, next) {
        try {
            const id = req.user.id;
            const profile = await Profile.findOne({ where: { UserId: id } });
            if (!profile) {
                throw { name: "Not Found", message: "Profile not found" };
            }
            res.status(200).json(profile);
        } catch (error) {
            console.log("🚀 ~ getProfiles ~ error:", error);
            next(error);
        }
    }

    static async updateProfile(req, res, next) {
        try {
            const { id } = req.params;
            const { username, age, preferences, imageUrl } = req.body;
            const profile = await Profile.findOne({ where: { UserId: id } });
            if (!profile) {
                throw { name: "Not Found", message: "Profile not found" };
            }
            await Profile.update(
                { username, age, preferences, imageUrl },
                { where: { UserId: id } }
            );
            res.status(200).json({ message: "Profile updated successfully" });
        } catch (error) {
            console.log("🚀 ~ updateProfile ~ error:", error)
            next(error)
        };
    }

    static async updateProfilePicture(req, res, next) {
        try {

            if (!req.file) {
                throw { name: "Bad Request", message: "File is required!" }
            }

            // Validasi tipe file (hanya image)
            const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedMimeTypes.includes(req.file.mimetype)) {
                throw { name: "Bad Request", message: "Only image files are allowed" }
            }

            const data = await Profile.findOne({ where: { "UserId": req.user.id } })

            if (!data) {
                throw { name: "Not Found", message: "Profile not found" }
            }

            const mimetype = req.file.mimetype;
            const base64File = req.file.buffer.toString("base64");

            const result = await cloudinary.uploader.upload(
                `data:${mimetype};base64,${base64File}`,
                {
                    folder: "Cinetix_Profiles",
                    public_id: `profile_${req.user.id}_${Date.now()}`,
                }
            );

            const newImgUrl = result.secure_url;

            await data.update({ imageUrl: newImgUrl });

            res.json({ message: `Image updated` });

        } catch (error) {
            console.log("🚀 ~ updateProfilePicture ~ error:", error)
            next(error);
        }
    }
}