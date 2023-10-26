const express = require('express')
const router = new express()
const findAllJournalsController = require('../controllers/findAllJournalsController')


router.post('/', findAllJournalsController.getJournals)

module.exports = router