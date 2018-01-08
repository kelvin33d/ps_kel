import * as passport from 'passport';
import { Strategy } from 'passport-local';
import * as Sequelize from 'sequelize';
import orm from '../../../../../config/lib/sequelize';

const {or, and, gt, lt} = Sequelize.Op;

export = () => {
 passport.use(new Strategy({
   usernameField: 'usernameOrEmail',
   passwordField: 'password'
 }, (usernameOrEmail, password, done) => {
   orm.User.findOne({
     where: {
       [or] : [{ username: usernameOrEmail.toLowerCase() }, { email: usernameOrEmail.toLowerCase()}]
     }
   }).then((user) => {
     if (!user || !user.authenticate(password)) {
       return done(null, false, {
         message: `Invalid username or password ( ${(new Date()).toLocaleTimeString()} )`
       });
     }
     return done(null, user);
   }).catch(err => {});
 }));
};
