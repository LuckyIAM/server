const ApiError = require('../error/ApiError')

module.exports = function(err, req, res, next){
    if(err instanceof ApiError){
        return res.status(err.status).json({message: err.message})
    }else{
        return res.status(503).json({message: 'Непредвиденная ошибка!'})
    }
}