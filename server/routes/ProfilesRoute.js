const express = require("express");
const router = express.Router();

const profileController = require("../controllers/ProfileController");
const authentication = require("../middleware/authentication");
const authorization = require("../middleware/authorization_profile");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.use(authentication)

router.get("/", authorization, profileController.getProfiles);

router.patch(
    "/update-image",
    upload.single("newImage"),
    profileController.updateProfilePicture
);

router.put("/:id", authorization, profileController.updateProfile);

module.exports = router;