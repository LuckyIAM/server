const express = require('express')
const router = new express()
const user = require('../controllers/userController')
const authMidlleware = require('../middleware/authMidlleware')

router.post('/registration', user.registration)
router.post('/login', user.login)
router.get('/auth', authMidlleware, user.check)


module.exports = router