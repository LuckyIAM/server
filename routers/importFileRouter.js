const express = require('express')
const router = new express()
const importFile = require('../controllers/iportFileController')
const authMiddleware = require('../middleware/authMidlleware')

router.post('/',authMiddleware, importFile.uploadFile)


module.exports = router