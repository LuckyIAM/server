const express = require('express')
const router = new express()
const getDataFromNumberBox = require('../controllers/getDataFromNumberBoxController')

router.post('/', getDataFromNumberBox.getOneDataFromIdBox)


module.exports = router