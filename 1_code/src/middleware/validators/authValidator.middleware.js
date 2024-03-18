function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    else {
        next();
    }
}

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }
    else{
        return res.redirect('/auth/login');
    }
}
function checkAuthenticatedMember(req, res, next) {
    const userRole = req.user.userRole;

    if (userRole.toLowerCase() === 'member') {
        return next();
    }
    else {
        return res.redirect('/');
    }
}

function checkAuthenticatedEmployee(req, res, next) {

    if (!req.isAuthenticated()) {
        return res.redirect('/auth/login');
    }

    const userRole = req.user.userRole;
    
    if (['Administrator', 'StaffMember'].includes(userRole)) {
        return next();
    }
    else {
        return res.redirect('/');
    }
}
function checkAuthenticatedAdministrator(req, res, next) {
    const userRole = req.user.userRole;

    if (userRole.toLowerCase() === 'administrator') {
        return next();
    }
    else {
        return res.redirect('/');
    }
}

module.exports  = {checkAuthenticated, checkNotAuthenticated, checkAuthenticatedMember, checkAuthenticatedEmployee, checkAuthenticatedAdministrator};