import * as passport from 'passport';
import * as path from 'path';
import config from '../../../../config/config';
export = (app, db) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findOne({
      _id: id
    }, '-salt -password', (err, user) => {
      done(err, user);
    });
  });

  config.utils.getGlobbedPaths(path.join(__dirname, './strategies/**/*.js')).forEach((strategy) => {
    require(path.resolve(strategy))(config);
  });

  app.use(passport.initialize());
  app.use(passport.session());
}
