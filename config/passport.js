const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Saler = require('../models/Saler');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({usernameField : 'login'}, (login, password, done) => {
            // Match User
            Saler.findOne({login})
                .then(user => {
                    if (!user) {
                        return done(null, false, {message : 'Такого пользователя не существует'});
                    }
                    // Match password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;

                        if (isMatch) return done(null, user)
                        else return done(null, false, {message : 'Неверный пароль'});
                    })
                })
                .catch(err => console.error(err))
        })
    )

    passport.serializeUser(function(user, done) {
        done(null, user.id)
    });
    
    passport.deserializeUser(function(id, done) {
        Saler.findById(id, function(err, user) {
            done(err, user);
        })
    })
}