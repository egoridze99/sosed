const router = require('express').Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const {forwardAuthenticated ,ensureAuthenticated} = require('../config/auth');

const Buyer = require('../models/Buyer');
const Telefone = require('../models/Telefone');
const Transaction = require('../models/Transaction');

router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());

router.get('/', forwardAuthenticated, (req, res) => {
    res.render('welcome');
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard', {
        user : req.user
    });
})

router.post('/dashboard/getUser',  ensureAuthenticated, (req, res) => {
    const {number} = req.body;

    Buyer.findOne({telefoneNumber : number})
        .then(user => {
            if (!user) {
                res.send(JSON.stringify({error : 404}))
            } else {
                Transaction.find({telefone : number}, null, null)
                    .then(transactions => res.send(JSON.stringify({user, transactions})));
            };
        })
})

router.post('/dashboard/newUser',  ensureAuthenticated, (req, res) => {
    const {name, surname, telefone} = req.body;

    Buyer.findOne({telefoneNumber : telefone})
        .then(user => {
            if (user) {
                res.send(JSON.stringify({error : 200}));
            } else {
                const _id = new mongoose.Types.ObjectId();
                const newBuyer = new Buyer({
                    _id,
                    telefoneNumber : telefone,
                    buyer : {
                        name,
                        surname
                    },
                });

                const newTelefone = new Telefone({
                    name,
                    telefone
                });

                newTelefone.save()
                    .catch(err => console.error(err));

                newBuyer.save()
                    .then(() => console.log('Новый пользователь зарегестрирован'))
                    .then(() => {
                        res.send(JSON.stringify({
                            name,
                            surname,
                            telefone,
                            total : 0,
                            _id,
                            free : 14 
                        }));
                    })
                    .catch((err) => console.error(err));
            }
        })
});

router.post('/dashboard/addTransaction', (req, res) => {
    const {userId, transaction, date} = req.body;
    let getFree;

    transaction.saler = {
        name : req.user.name.firstName,
        surname : req.user.name.lastName
    };

    console.log(transaction);

    Buyer.findById(userId)
        .then(user => {
            user.total = user.total + Number(transaction.totalSum);
            if (user.free - Number(transaction.litres) < 0) {
                if (user.free % 1 !== 0) {
                    user.free = 14 + user.free - Number(transaction.litres);
                    transaction.litres = Number(transaction.litres) + 0.5;
                    transaction.getFree = true;
                } else {
                    user.free = 14 + user.free - Number(transaction.litres) + 1;
                    transaction.getFree = true;
                }
            } else if (user.free - Number(transaction.litres) === 0) {
                user.free = 14;
                transaction.getFree = true;
            } else {
                user.free -= Number(transaction.litres);
                transaction.getFree = false;
            };

            const newTransaction = new Transaction({
                litres : transaction.litres,
                totalSum : transaction.totalSum,
                saler : transaction.saler,
                dateString : transaction.date,
                date : new Date(),
                getFree : transaction.getFree,
                telefone : user.telefoneNumber
            })

            user.save()
                .then(() => console.log('Информация о пользователе обновлена'))
                .then(() => {
                    newTransaction.save()
                        .then(() => {
                            Transaction.find({telefone : user.telefoneNumber}, null, null)
                                .then(transact => res.send(JSON.stringify({user, transactions : transact})))
                                .catch(err => console.err(err))
                        })
                        .catch(err => error);
                })
                .catch(err => console.error(err));
        })
        .catch(err => console.error(err))
})

module.exports = router;