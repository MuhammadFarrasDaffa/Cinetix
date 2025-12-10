const express = require("express");
const router = express.Router();

const profileController = require("../controllers/ProfileController");
const authentication = require("../middleware/authentication");
const authorization = require("../middleware/authorization_profile");

router.use(authentication)

router.get("/:id", authorization, profileController.getProfiles);
router.put("/:id", authorization, profileController.updateProfile);

module.exports = router;