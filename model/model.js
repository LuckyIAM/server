const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    name: {type: DataTypes.STRING, defaultValue: 'user'},
    mail: {type: DataTypes.STRING, unique: true, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    role: {type: DataTypes.STRING, defaultValue: "USER"}
})

const ContentData = sequelize.define('content_data', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    num_box: {type: DataTypes.STRING},
    quantity: {type: DataTypes.INTEGER},
    name_journal: {type: DataTypes.STRING, },
    collector: { type: DataTypes.STRING}
}/*,
{
    indexes:[
        {
            fields: ['name_journal', 'collector']
        }
    ]
}*/)

const ImportFile = sequelize.define('import_file', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    file_up: {type: DataTypes.STRING},
    file_name: {type: DataTypes.STRING},
    maker: {type: DataTypes.INTEGER},
    data: {type: DataTypes.INTEGER}
})
const DetailedData = sequelize.define('detailed_data', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    name: {type: DataTypes.STRING, allowNull: true},
    years: {type: DataTypes.INTEGER},
    edition: {type:DataTypes.STRING}
})

User.hasMany(ContentData)
ContentData.belongsTo(User)

User.hasMany(ImportFile)
ImportFile.belongsTo(User)

ImportFile.hasMany(ContentData)
ContentData.belongsTo(ImportFile)

ContentData.hasMany(DetailedData)
DetailedData.belongsTo(ContentData)

module.exports ={
    User,
    ContentData,
    ImportFile,
    DetailedData
}