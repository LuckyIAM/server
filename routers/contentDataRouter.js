const express = require('express')
const router = new express()
const contentdata = require('../controllers/contentDataController')
const checkMiddleware = require('../middleware/checkRoleMidleware')
const authMiddleware = require('../middleware/authMidlleware')

router.post('/search', authMiddleware, contentdata.getAllDatas)
router.get('/:id', authMiddleware, contentdata.getOneData)
router.post('/parse', authMiddleware ,contentdata.parsData)


module.exports = router