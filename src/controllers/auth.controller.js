const express = require('express');
const debug = require('debug')('app:authRouter');
const userDataAccess = require('../data/userDataAccess');
const bcrypt = require('bcrypt');
const passport = require('passport');

const authRouter = express.Router();

const registerView = async (req, res, next) => {
    res.render('authViews/register', {});
}

const register = async (req, res, next) => {
    const { name, phone, email, dob, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    let result = await userDataAccess.createUser(name, phone, email, passwordHash, dob);
    if (result) {
        res.redirect('/auth/login');
    }
    else {
        request.flash('Error', 'Failed to register user')
        res.redirect('/auth/register');
    }
}


const loginView = async (req, res, next) => {
    res.render('authViews/login', {});
}

const login = (
    passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true
}));


module.exports = {register, registerView, login, loginView };