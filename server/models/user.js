const mongoose = require("mongoose")

const Schema = mongoose.Schema

const userSchema = new Schema({
     name:String,
     online:Boolean,
     password:String
})

module.exports = mongoose.model('User', userSchema);