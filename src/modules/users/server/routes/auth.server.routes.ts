import * as passport from 'passport'
import users from '../controllers/users.server.controller';
export = (app) => {
  app.route('/api/auth/forgot').post(users.forgot);
  app.route('/api/auth/reset/:token').post(users.validateResetToken);
  app.route('/api/auth/reset/:token').post(users.reset);

  app.route('/api/auth/signup').post(users.signup);
  app.route('/api/auth/signin').post(users.signin);
  app.route('/api/auth/signout').get(users.signout);
};