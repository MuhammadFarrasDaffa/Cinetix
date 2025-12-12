const express = require('express')
const router = express.Router()

const WatchlistRoute = require('./WatchlistRoute')
const ProfilesRoute = require('./ProfilesRoute')
const MovieRoute = require('./MovieRoute')
const CollectionRoute = require('./CollectionRoute')
const PaymentRoute = require('./PaymentsRoute')

const userController = require('../controllers/UserController')
const errorHandler = require('../middleware/errorHandler')

router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/google-login', userController.googleLogin);

router.use('/watchlists', WatchlistRoute)
router.use('/profiles', ProfilesRoute)
router.use('/movies', MovieRoute)
router.use('/collections', CollectionRoute)
router.use('/payments', PaymentRoute)

router.use(errorHandler)

module.exports = router