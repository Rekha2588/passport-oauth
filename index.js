const express = require('express');
require('dotenv').config();
const authRouter = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes')
const passportSetup = require('./config/passport-setup');
const connectDb = require('./config/dbConnection');
const passport = require('passport');
const session = require('express-session');


const port = process.env.PORT || 5000;

const app = express();
app.set('view engine','ejs');
app.use(express.json());

app.use(session({
   secret: process.env.SECURITY_TOKEN,
   resave: false,
   saveUninitialized: true,
   cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

connectDb();

app.use('/auth', authRouter);
app.use('/profile', profileRoutes);

app.get('/', (req, res) => {
    res.render('home');
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})

