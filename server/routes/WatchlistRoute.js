const express = require('express');
const router = express.Router();

const watchlistController = require("../controllers/WatchlistController");
const authentication = require("../middleware/authentication");

router.use(authentication);

router.get("/", watchlistController.getWatchlists);
router.get("/:id", watchlistController.checkWatchlist);
router.post("/:id", watchlistController.addWatchlist);
router.delete("/:id", watchlistController.removeWatchlist);

module.exports = router;