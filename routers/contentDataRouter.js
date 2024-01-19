const express = require('express')
const router = new express()
const contentdata = require('../controllers/contentDataController')
const checkMiddleware = require('../middleware/checkRoleMidleware')
const authMiddleware = require('../middleware/authMidlleware')

router.post('/search', contentdata.getAllDatas)
router.get('/:id', contentdata.getOneData)
router.post('/parse', contentdata.parsData)


module.exports = router