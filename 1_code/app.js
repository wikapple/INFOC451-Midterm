/**
 * Imports
 */
const express = require('express');
const dotenv = require('dotenv');
const chalk = require('chalk');
const debug = require('debug')('app');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const path = require('path');
const morgan = require('morgan');
const session = require('express-session');
dotenv.config({path: '.env'});
const UserDataAccess = require('./src/data/userDataAccess');
const passport = require('passport');
const authRoutes = require('./src/routes/auth.routes');
const homeRoutes = require('./src/routes/home.routes');
const mediaRoutes = require('./src/routes/media.routes');
const itemRoutes = require('./src/routes/item.routes');
const apiRoutes = require('./src/routes/api.routes');
const memberRoutes = require('./src/routes/member.routes');
const rentalAgreementRoutes = require('./src/routes/rentalagreement.routes');
const expressLayouts = require('express-ejs-layouts');
const app = express();
app.use(express.static(path.join(__dirname, '/public/')));

app.set('views', './src/views/');
app.use(expressLayouts);
app.set('view engine', 'ejs');
const initializePassport = require('./src/config/passport');

this.userDataAccess = new UserDataAccess();
initializePassport (
    passport,
    async email => await this.userDataAccess.getUserByEmail(email),
    async id => await this.userDataAccess.getUserById(id)
 );


/**
 * Middleware
 */
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.layout = 'shared/layout.ejs';
    res.locals.currentUser = req.user;
    next();
});

app.use('/auth', authRoutes);
app.use('/', homeRoutes);
app.use('/media', mediaRoutes);
app.use('/item', itemRoutes);
app.use('/api', apiRoutes);
app.use('/member', memberRoutes);
app.use('/rentalagreement', rentalAgreementRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    debug(`Listening for requests on port ${PORT}`);
});