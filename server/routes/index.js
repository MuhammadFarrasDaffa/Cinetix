const express = require('express')
const router = express.Router()

const WatchlistRoute = require('./WatchlistRoute')
const ProfilesRoute = require('./ProfilesRoute')
const MovieRoute = require('./MovieRoute')

const userController = require('../controllers/UserController')
const errorHandler = require('../middleware/errorHandler')

router.post('/register', userController.register)
router.post('/login', userController.login)

router.use('/watchlists', WatchlistRoute)
router.use('/profiles', ProfilesRoute)
router.use('/movies', MovieRoute)

router.use(errorHandler)

module.exports = router