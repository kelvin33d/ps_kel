import * as path from 'path';
import * as passport from 'passport';
import * as Sequelize from 'sequelize';
import orm from '../../../../../config/lib/sequelize';

const {or, and, gt, lt} = Sequelize.Op;
function signup(req, res){
	// For security measurement we remove the roles from the req.body object
  delete req.body.roles;
  const user = new orm.User(req.body);
  user.provider = 'local';
  user.displayName = `${user.firstName} ${user.lastName}`;

  user.save().then(() => {
  	user.password = undefined;
  	user.salt = undefined;
  	req.login(user, (err) => {
  		if(err) {
  			res.status(400).send(err);
  		} else {
  			res.json(user);
  		}
  	});
  }).catch((err) => {
  	console.log(err);
  })
};

function signin(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err || !user) {
      res.status(422).send(info);
    } else {
      user.password = undefined;
      user.salt = undefined;

      req.login(user, (err) => {
        if (err) {
          res.status(400).send(err);
        } else {
          res.json(user);
        }
      });
    }
  })(req, res, next);
};

function signout(req, res) {
  req.logout();
  res.redirect('/');
};

function oauthCall(strategy, scope) {
  return function(req,res,next) {
    if (req.query && req.query.redirect_to) {
      req.session.redirect_to = req.query.redirect_to;
    }
    //Authenticate
    passport.authenticate(strategy, scope)(req, res, next);
  }
};

function oauthCallback(strategy) {
  return function(req, res, next) {
    passport.authenticate(strategy, (err, user, info) => {
      if (err) {
        return res.redirect('/authentication/signin?err=' + encodeURIComponent(err));
      }
      if(!user) {
        return res.redirect('/authentication/signin');
      }
      req.login(user, (err) => {
        if(err) {
          return res.redirect('/authentication/signin');
        }
        return res.redirect(info.redirect_to || '/');
      });
    })(req, res, next);
  }
};

function saveOAuthUserProfile(req, providerUserProfile, done) {
  const info = {};

  if (noReturnUrls.indexOf(req.session.redirect_to) === -1) {
    info.redirect_to = req.session.redirect_to;
  }
  if(!req.user) {
    const searchMainProviderIdentifierField = `providerData.${providerUserProfile.providerIdentifierField}`;
    const searchAdditionalProviderIdentifierField = `additionalProvidersData.${providerUserProfile.provider}.${providerUserProfile.providerIdentifierField}`;

    const mainProviderSearchQuery = {};

    mainProviderSearchQuery.provider = providerUserProfile.provider;
    mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    const additionalProviderSearchQuery = {};
    additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    const searchQuery = {
      [or]: [mainProviderSearchQuery, additionalProviderSearchQuery]
    };

    orm.User.findOne({where:searchQuery}).then((user) => {
      if(!user) {
        const possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

        orm.User.findUniqueUsername(possibleUsername, null, (availableUsername) => {
          user = new orm.User({
            firstName: providerUserProfile.firstName,
            lastName: providerUserProfile.lastName,
            username: availableUsername,
            displayName: providerUserProfile.displayName,
            profileImageURL: providerUserProfile.profileImageURL,
            provider: providerUserProfile.provider,
            providerData: providerUserProfile.providerData
          });

          user.email = providerUserProfile.email;

          user.save((err) => {
            return done(err, user, info);
          });
        });
      } else {
        return (err, user, info);
      }
    });
  } else {
    const user = req.user;

    if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
      if (!user.additionalProvidersData) {
        user.additionalProvidersData = {};
      }

      user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

      // user.markModified('additionalProvidersData');

      user.save().then(() => {
        return done(err, user, info);
      }).catch((err) => {
        return done(err, user, info);
      });
    } else {
      return done(new Error('User is already connected using this provider'), user);
    }
  }
};

function removeOAuthProvider(req, res, next) {
  const user = req.user;
  const provider = req.query.provider;

  if(!user) {
    return res.status(401).json({
      message: 'User is not authenticated'
    });
  } else if(!provider) {
    res.status(400).send();
  }

  if (user.additionalProvidersData[provider]) {
    delete user.additionalProvidersData[provider];

    // user.markModified('additionalProvidersData'); //sequelize version?

  }

  user.save().then(() => {
    req.login(user,(err) => {
      if(err) {
        return res.status(400).send(err);
      } else {
        res.json(user);
      }
    })
  }).catch((err) => {
    return res.status(422).send({
      message: err
    });
  });
};

export { signup, signin, signout, oauthCall, oauthCallback, saveOAuthUserProfile, removeOAuthProvider};

