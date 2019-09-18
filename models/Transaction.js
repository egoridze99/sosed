const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
    litres : Number,
    totalSum : Number,
    saler : {
        name : String,
        surname : String
    },
    dateString : String,
    date : Date,
    getFree : Boolean,
    telefone : String
})

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;