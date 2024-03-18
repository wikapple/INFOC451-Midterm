const express = require('express');
const debug = require('debug')('app:authRouter');
const homeController = require('../controllers/home.controller');
const authValidator = require('../middleware/validators/authValidator.middleware');


const homeRouter = express.Router();

homeRouter.get('/', authValidator.checkAuthenticated, homeController.home);

module.exports = homeRouter;