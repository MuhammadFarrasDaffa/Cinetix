const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/PaymentController");
const authentication = require("../middleware/authentication");

router.post("/webhook", (req, res, next) => {
    paymentController.handleNotification(req, res, next);
});

// Protected routes (require authentication)
router.use(authentication);
router.post("/create", paymentController.createTransaction);

module.exports = router;