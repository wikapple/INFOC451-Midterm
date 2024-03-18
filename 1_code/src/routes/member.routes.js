const express = require('express');
const debug = require('debug')('app:memberRouter');
const MemberController = require('../controllers/member.controller');
const authValidator = require('../middleware/validators/authValidator.middleware');

const memberRouter = express.Router();
const memberController = new MemberController();

memberRouter.get('/', memberController.getMemberListView.bind(memberController));

module.exports = memberRouter;