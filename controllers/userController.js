const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const {User, ContentData, ImportFile} = require('../model/model')
const jwt = require('jsonwebtoken')

const generateJwt = (id, mail, name, role) => {
    return jwt.sign({id: id, mail: mail, name: name, role: role}, 
        process.env.SECRET_KEY,
        {expiresIn: '24H'})
}

class UserController{
    async registration(req, res, next){
        const {name, mail, password, role} = req.body
        if(!mail || !password){
            return next(ApiError.badRequest('Некоректный email или пароль'))
        }
        const candidat = await User.findOne({
            where: {mail}
        })

        if(candidat){
            return next(ApiError.badRequest('Пользователь с такой электронной почты уже сушествует'))
        }
        const hashPassword = await bcrypt.hash(password, 5)

        const user = await User.create({name, mail, password: hashPassword, role})

        const token = generateJwt(user.id, user.mail, user.name, user.role)

        res.json({token, name: user.name, role: user.role})
    }
    async login(req, res, next){
        const {mail, password} = req.body
        const user = await User.findOne({
            where: {
                mail: mail
            }
        })
        if(!user){
            return next(ApiError.forbiden('Пользывателя с таким mail не найден!'))
        }
        
        let comparePassword = bcrypt.compareSync(password, user.password)
        if(!comparePassword){
            return next(ApiError.internal('Указан неверный пароль'))
        }

        const token = generateJwt(user.id, user.mail, user.name, user.role)
        res.json({token, name: user.name, role: user.role})
    }
    async check(req, res, next){
        const token = generateJwt(req.user.id, req.user.mail, req.user.name, req.user.role)
        res.json({token})
    }
}

module.exports = new UserController()