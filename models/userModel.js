const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: String,
    googleId: String,
    password: String
});

const User = mongoose.model('users', userSchema)
module.exports = User;