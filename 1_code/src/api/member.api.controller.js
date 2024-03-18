const chalk = require('chalk');
const debug = require('debug')('app:memberApiController');
const MemberDataAccess = require('../data/memberDataAccess');

class MemberApiController {
    
    constructor() {
        this.memberDataAccess = new MemberDataAccess();
    }

    async getMembers(req, res) {
        const filterValue = req.query.filter;

        let memberList;
        if (filterValue) {
            memberList = await this.memberDataAccess.getMembersByFilter(filterValue);
        } else {
            memberList = await this.memberDataAccess.getAllMembers();
        }
        res.status(200).json(memberList);
    }
} 

module.exports = MemberApiController;