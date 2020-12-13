const mongoose = require("mongoose")

const Schema = mongoose.Schema

const msgSchema = new Schema({
     msg:String,
     userId:String
})

module.exports = mongoose.model('Msg', msgSchema);