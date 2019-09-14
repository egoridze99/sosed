const inquirer = require('inquirer');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Saler = require('../models/Saler');

const toDo = require('./inquirerHelper/toDoQuestions');
const registerQuestions = require('./inquirerHelper/registerQuestions');

const db = require('../config/keys').MongoURI;
mongoose.Promise = global.Promise;
mongoose.connect(db, {useNewUrlParser: true})
    .then(() => console.log('\nMongodb connected...'))
    .then(() => initial())
    .catch(err => console.log(err))

function registerSaler() {
    inquirer.prompt(registerQuestions)
        .then(answers => {
            const newSaler = new Saler ({
                _id : new mongoose.Types.ObjectId(),
                name : {
                    firstName : answers.firstName,
                    lastName : answers.lastName
                },
                login : answers.login,
                password : answers.password
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newSaler.password, salt, (err, hash) => {
                    if (err) throw err;

                    newSaler.password = hash;

                    newSaler.save()
                        .then(user => console.log('Succesly added to database'))
                        .catch(error => console.error(error))
                })
            })
        });
}

function initial() {
    inquirer.prompt(toDo)
    .then(answer => {
        switch (answer.option) {
            case 'Зарегестрировать продавца':
                registerSaler();
                break;
            case 'Удалить продавца':
                deleteSaler();
                break;
            default:
                break;
        }
    });
};