const express = require('express');
const router = express.Router();

const watchlistController = require("../controllers/WatchlistController");
const authentication = require("../middleware/authentication");
const authorization = require('../middleware/authorization_watchlist');

router.use(authentication);

router.get("/", authorization, watchlistController.getWatchlists);
router.post("/:id", authorization, watchlistController.addWatchlist);
router.delete("/:id", authorization, watchlistController.removeWatchlist);

module.exports = router;