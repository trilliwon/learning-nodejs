const express = require('express')
const passport = require('passport')
const User = require('./models/user')

const router = express.Router()

router.use(function (req, res, next) {
    res.locals.currentUser = req.user
    res.locals.errors = req.flash('error')
    res.locals.infos = req.flash('info')
    next()
})

router.get('/', function (req, res, next) {
    User.find()
        .sort({ createdAt: 'descending' })
        .exec(function (err, users) {
            if (err) { return next(err) }
            res.render('index', { users: users })
        })
})

router.get('/users/:username', function (req, res, next) {
    User.findOne({ username: req.params.username }, function (err, user) {
        if (err) { return next(err) }
        if (!user) { return next(404) }
        res.render('profile', { user })
    })
})

router.get('/signup', function (req, res) {
    res.render('signup')
})

router.post("/signup", function (req, res, next) {
    const username = req.body.username
    const password = req.body.password

    User.findOne({ username }, function (err, user) {
        if (err) { return next(err) }
        if (user) {
            req.flash("error", "User already exists")
            return res.redirect("/signup");
        }

        var newUser = new User({
            username: username,
            password: password
        })
        newUser.save(next)
    })
}, passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/signup",
    failureFlash: true
}))

router.get('/login', function (req, res) {
    res.render('login')
})

router.post('/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

router.get('/logout', function (req, res) {
    req.logout()
    res.redirect('/')
})

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        req.flash('info', 'You must be logged in to see this page.')
        res.redirect('/login')
    }
}

router.get('/edit', ensureAuthenticated, function (req, res) {
    res.render('edit')
})

router.post('/edit', ensureAuthenticated, function (req, res, next) {
    req.user.displayName = req.body.displayname
    req.user.bio = req.body.bio
    req.user.save(function (err) {
        if (err) {
            next(err)
            return
        }
        req.flash('info', 'Profile updated!')
        res.redirect('/edit')
    })
})

// Delete
router.post('/user', ensureAuthenticated, function (req, res, next) {
    console.log(req.body.username)
    if (req.body.username === '') {
        req.flash('info', `${req.body.username} is empty!`)
        res.redirect('/')
    } else {
        User.deleteOne({ username: req.body.username }, function (err) {
            if (err) { return next(err) }
            req.flash('info', `${req.body.username} is deleted!`)
            return res.redirect('/')
        })
    }
})

module.exports = router