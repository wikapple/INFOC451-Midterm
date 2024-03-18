const express = require('express');
const debug = require('debug')('app:rentalAgreementRouter');
const RentalAgreementController = require('../controllers/rentalAgreement.controller');
const authValidator = require('../middleware/validators/authValidator.middleware');

const rentalAgreementRouter = express.Router();
const rentalAgreementController = new RentalAgreementController();

rentalAgreementRouter.get('/checkout', rentalAgreementController.checkoutView.bind(rentalAgreementController));  
rentalAgreementRouter.get('/checkin', rentalAgreementController.checkinView.bind(rentalAgreementController));  




module.exports = rentalAgreementRouter;