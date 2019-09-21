const mongoose = require('mongoose');

const BuyerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    telefoneNumber : String,
    buyer : {
        name : String,
        surname : String
    },
    total : {
        type : Number,
        default : 0
    },
    free : {
        type : Number,
        default : 14
    },
    isPassword : {
        type : Boolean,
        default : false,
    },
    password : {
        type : String,
        default : ""
    }
});

const Buyer = mongoose.model('Buyer', BuyerSchema);

module.exports = Buyer;