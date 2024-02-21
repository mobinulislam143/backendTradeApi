const mongoose = require('mongoose')

const DataSchema = mongoose.Schema({
    name: {type:String, required: true},
    email: {type: String, required: true, unique: true},
    mobile: {type:String, required: true},
    password: { type: String, required: true },
    department: {type: String, required: true},
    profileImg: {type: String, default:'https://www.testhouse.net/wp-content/uploads/2021/11/default-avatar.jpg'}
}, {timestamps: true,versionKey: false})

const UserModel = mongoose.model('users', DataSchema)

module.exports = UserModel
