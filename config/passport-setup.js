const passport = require('passport');
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('./../models/userModel');
const bcrypt = require('bcrypt');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        //console.log(user);
        if (!user) {
            return done(null, false, { error: 'Incorrect email/password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { error: 'Incorrect email/password' });
        }
        done(null, user);
    } catch (error) {
        done(error);
    }
}));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({ googleId: profile.id }).then((currentUser) => {
        if (currentUser) {
            console.log("User already exists!");
            done(null, currentUser);
        } else {
            new User({
                email: profile.emails[0].value,
                googleId: profile.id
            }).save().then((newUser) => {
                console.log('New User created: ' + newUser);
                done(null, newUser);
            })
        }
    })
})
);