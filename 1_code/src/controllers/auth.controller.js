const express = require('express');
const debug = require('debug')('app:authController');
const UserDataAccess = require('../data/userDataAccess');
const bcrypt = require('bcrypt');
const passport = require('passport');

class AuthController {

    constructor() {
        this.userDataAccess = new UserDataAccess();
    }

    async registerView (req, res, next) {
        res.render('authViews/register', {});
    }
    
    async registerMember(req, res, next) {
        const { name, phone, email, dob, password } = req.body;
    
        var userAlreadyExists = await this.userDataAccess.getUserByEmail(email);
        if(userAlreadyExists) {
            debug('user already exists');
            req.flash('error', 'User already exists');
            res.status(400).redirect('/auth/register');
            return;
        }
    
        const passwordHash = await bcrypt.hash(password, 10);
        let result = await this.userDataAccess.createMember(name, phone, email, passwordHash, dob);
        if (result) {
            res.redirect('/auth/login');
        }
        else {
            request.flash('Error', 'Failed to register new member')
            res.redirect('/auth/register');
        }
    }
    
    
    async loginView(req, res, next) {
        res.render('authViews/login', {});
    }
    
    login = (
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/auth/login',
            failureFlash: true
        }));
    
    logout (req, res) {
        req.logout(err => {
            if (err) {
                debug("Error: ", err);
                return next(err);
            }
            res.redirect('/');
        });
    };
}


module.exports = AuthController;