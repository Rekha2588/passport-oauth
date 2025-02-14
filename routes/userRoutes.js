const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('./../models/userModel')
const { ensureAuthenticated } = require('./../middleware/validateCookie');

router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
        res.status(400);
        throw new Error("Email already exists!");
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ ...req.body, password: hashedPassword });
    if (user) {
        res.status(201).json({
            _id: user.id,
            email: user.email,
            dob: user.dateOfBirth,
            phoneNumber: user.phoneNumber
        });
    } else {
        res.status(400);
        throw new Error("User data is not valid");
    }
});

router.post('/signin', async (req, res) => {
    passport.authenticate('local', (error, user, info) => {

        if (error) {
            return res.status(500).json({ error: 'Something went wrong' })
        }
        if (!user) {
            return res.status(401).json(info)
        }
        req.login(user, (error) => {
            if (error) {
                return res.status(500).json({ error: 'Something went wrong' })
            }
            return res.status(200).json({ email: user.email });
        })
    })(req, res)
})


router.get('/protected', ensureAuthenticated, (req, res) => {
    res.json({ email: req.user.email })
})

module.exports = router;