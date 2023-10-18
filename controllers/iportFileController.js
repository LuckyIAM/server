const {ImportFile, User} = require('../model/model')
const uuid = require('uuid')
const path = require('path')
const ApiError = require('../error/ApiError')
const jwt = require('jsonwebtoken')


class UploadFile{
    async uploadFile(req, res, next){
        try{
            const {file_name, create_data,} = req.body
            const {file_up} = req.files

            let fileName = uuid.v4() + '.csv'
            file_up.mv(path.resolve(__dirname, '..', 'filesUpload', fileName))
            const token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            console.log(decoded.name);

            const user = await User.findOne({
                where:{
                    mail: decoded.mail
                }
            })
            const fileUpload = await ImportFile.create({file_name, maker: user.id, create_data, file_up: fileName})

            return res.json(fileUpload)
        }catch(e){
            next(ApiError.badRequest(e.message))
        }

    }
}

module.exports = new UploadFile()