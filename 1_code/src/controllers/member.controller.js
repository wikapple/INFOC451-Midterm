const chalk = require('chalk');
const debug = require('debug')('app:memberController');
const MemberDataAccess = require('../data/memberDataAccess');

class MemberController {
    
    constructor() {
        this.memberDataAccess = new MemberDataAccess();
    }

    async getMemberListView(req, res) {
        let viewModel = {};
        const filterValue = req.query.filter;
        
        let memberList;
        if (filterValue) {
            memberList = await this.memberDataAccess.getMembersByFilter(filterValue);
        } else {
            memberList = await this.memberDataAccess.getAllMembers();
        }

        viewModel.memberList = memberList;
        
        res.render(`memberViews/memberListView.ejs`, { viewModel });
    }
} 

module.exports = MemberController;