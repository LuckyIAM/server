const express  = require('express')
const router = new express()
const logMatchController = require('../controllers/logMatchController')

router.get('/',logMatchController.logMatch)

module.exports = router