const mongoose = require('mongoose');
const Buyer = require('../models/Buyer');
const Transaction = require('../models/Transaction');
const fs = require('fs');

const usersJson = require('./users.json');
const transactionsJson = require('./transactions.json');

const db = require('../config/keys').MongoURI;
mongoose.Promise = global.Promise;
// mongoose.connect(db, {useNewUrlParser: true})
//     .then(() => console.log('\nMongodb connected...'))
//     .then(() => {
//         Buyer.find({}, null, null)
//             .then(users => {
//                 const json = JSON.stringify(users, null, '  ');

//                 let transactions = [];

//                 users.forEach(user => {
//                     const tel = user.telefoneNumber;

//                     user.transactions.forEach(transaction => {
//                         transaction.telefone = tel;
//                     });

//                     transactions.push(user.transactions);
//                 });

//                 transactions = transactions.flat();
//                 const trJson = JSON.stringify(transactions, null, '  ');

//                 fs.writeFile('users.json', json, 'utf8', function(err) {
//                     if (err) throw err;

//                     console.log('Users created');
//                 });

//                 fs.writeFile('transactions.json', trJson, 'utf8', function(err) {
//                     if (err) throw err;

//                     console.log('transactions created');
//                 });
//             })
//     })
//     .catch(err => console.log(err))

mongoose.connect(db, {useNewUrlParser: true})
    .then(() => console.log('bd is ready'))
    .then(() => {
        transactionsJson.forEach(transaction => {
            const newTransaction = new Transaction({
                litres : Number(transaction.litres),
                totalSum : Number(transaction.totalSum),
                saler : transaction.saler,
                dateString : transaction.date,
                date : new Date(),
                getFree : transaction.getFree,
                telefone : transaction.telefone
            });

            newTransaction.save()
                .then(() => console.log('ok!'))
                .catch(err => console.err(err));
        })
    })