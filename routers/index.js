const express = require('express')
const router = new express()
const user = require('./userRouter')
const importFile = require('./importFileRouter')
const contentData = require('./contentDataRouter')



router.use('/v1/importfile', importFile)
router.use('/v1/user', user)
router.use('/v1/contentdata', contentData)


module.exports = router