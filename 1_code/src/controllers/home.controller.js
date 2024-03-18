const debug = require('debug')('app:homeController');

const home = (req, res) => {

    const userRole = req.user.userRole;
    let userDashboard = ['Administrator', 'StaffMember'].includes(userRole) ?
        'employeeHome' : 'memberHome';

    res.render(`homeViews/${userDashboard}.ejs`, {'user' : req.user.name});
}


module.exports = {home};