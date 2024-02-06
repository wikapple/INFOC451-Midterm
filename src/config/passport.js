const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {
        const user = await getUserByEmail(email);
        if (user == null) {
            return done(null, false, { message: 'No user with that email'});
        }
        try {
            if(await bcrypt.compare(password, user['PasswordHash'])) {
                return done(null, user);
            } else {
                debug('password incorrect');
                return done(null, false, { message: 'Password incorrect' });
            }
        } catch (error) {
            return done(error);
        }
    }

    passport.use(new localStrategy({ usernameField: 'email'},
     authenticateUser));
    passport.serializeUser((user, done) => done(null, user.UserId));
    passport.deserializeUser( async (id, done) => {
        return done(null, await getUserById(id));
    });
}

module.exports = initialize;