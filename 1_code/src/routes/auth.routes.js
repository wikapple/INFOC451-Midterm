const express = require('express');
const authRouter = express.Router();
const AuthController = require('../controllers/auth.controller');
const authValidator = require('../middleware/validators/authValidator.middleware');

const authController = new AuthController();


authRouter.get('/login', authValidator.checkNotAuthenticated, authController.loginView.bind(authController));
authRouter.post('/login', authValidator.checkNotAuthenticated, authController.login.bind(authController));
authRouter.post('/logout', authValidator.checkAuthenticated, authController.logout.bind(authController));
authRouter.get('/register', authValidator.checkNotAuthenticated, authController.registerView.bind(authController));
authRouter.post('/member/register', authValidator.checkNotAuthenticated, authController.registerMember.bind(authController));

module.exports = authRouter;