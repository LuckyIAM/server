const express  = require('express')
const router = new express()
const logMatchController = require('../controllers/logMatchController')

router.get('/',logMatchController.logMatch)
router.get('/set', logMatchController.getSet)

module.exports = router