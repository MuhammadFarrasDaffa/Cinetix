const express = require('express')
const router = express.Router()

const collectionController = require('../controllers/CollectionController')
const authentication = require('../middleware/authentication')

router.use(authentication)

router.get('/', collectionController.getCollections)
router.delete('/:id', collectionController.deleteCollection)

module.exports = router