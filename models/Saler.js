const mongoose = require('mongoose');

const salerSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name : {
        firstName : String,
        lastName : String
    },
    login : String,
    password : String,
    date : {
        type : Date,
        default : Date.now
    }
});

const Saler = mongoose.model('Saler', salerSchema);

module.exports = Saler;