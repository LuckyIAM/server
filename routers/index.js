const express = require('express')
const router = new express()
const user = require('./userRouter')
const importFile = require('./importFileRouter')
const contentData = require('./contentDataRouter')
const logMatchRouter = require('./logMatchRouter')
const getDataFromNumberBox = require('./getDataFromNumberBoxRouter')


router.use('/v1/importfile', importFile)
router.use('/v1/user', user)
router.use('/v1/contentdata', contentData)
router.use('/v1/logmatch', logMatchRouter)
router.use('/v1/idbox', getDataFromNumberBox)


module.exports = router