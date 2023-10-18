require('dotenv').config()
const express = require('express')
const PORT  = process.env.PORT || 5000
const app = express()
const sequelize = require('./db')
const model = require('./model/model')
const router = require('./routers/index')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const path = require('path')
const errorHandler = require('./middleware/errorHandlingMiddlewere')


app.use(cors())
app.use(express.json())
app.use(fileUpload({}))
app.use(express.static(path.resolve(__dirname, 'filesUpload')))
app.use('/api', router)
app.use(errorHandler)

const start = async () =>{
    try{
        await sequelize.authenticate()
        await sequelize.sync()
        
        app.listen(PORT, () => {
            console.log(`Server started on PORT ${PORT}`);
        })
    } catch(e){
        console.log(e);
    }
}


start()