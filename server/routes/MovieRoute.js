const express = require("express");
const router = express.Router();

const movieController = require("../controllers/MovieController");
const authentication = require("../middleware/authentication");

router.use(authentication);

router.get("/", movieController.getMovies);
router.get("/recommendations", movieController.getRecommendations);
router.get("/:id", movieController.getMovieById);

module.exports = router;