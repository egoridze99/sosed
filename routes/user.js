const router = require('express').Router();
const passport = require('passport');
const { forwardAuthenticated } = require('../config/auth');

router.get('/login', forwardAuthenticated, (req, res) => {
    res.render('login');
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect : '/dashboard',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/user/login');
  });


module.exports = router;