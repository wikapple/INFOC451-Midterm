const chalk = require('chalk');
const debug = require('debug')('app:rentalAgreementController');
const MemberDataAccess = require('../data/memberDataAccess');
const ItemDataAccess = require('../data/itemDataAccess');

class RentalAgreementController {
    
    constructor() {
        this.memberDataAccess = new MemberDataAccess();
        this.itemDataAccess = new ItemDataAccess();
    }

    async checkoutView(req, res) {
        let viewModel = {};
        const {memberId, rentalItemId} = req.query;
        
        if(memberId) {
            viewModel.member = await this.memberDataAccess.getMemberById(memberId);
        }

        if(rentalItemId) {
            viewModel.rentalItem = await this.itemDataAccess.getItemByGuid(rentalItemId);
        }
                
        res.render(`rentalAgreementViews/checkoutView.ejs`, { viewModel });
    }
    async checkinView(req, res) {
        let viewModel = {};
        const {rentalItemId} = req.query;

        if(rentalItemId) {
            viewModel.rentalItem = await this.itemDataAccess.getItemByGuid(rentalItemId);
        }
                
        res.render(`rentalAgreementViews/checkinView.ejs`, { viewModel });
    }
} 

module.exports = RentalAgreementController;