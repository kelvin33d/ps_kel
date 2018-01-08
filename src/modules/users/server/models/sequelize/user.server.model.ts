import * as owasp from 'owasp-password-strength-test';
import * as crypto from 'crypto';
import * as sequelize from 'sequelize';
import generatePassword from '../../../../../config/lib/generate-password';
import config from '../../../../../config/config';

owasp.config(config.shared.owasp);

const validateLocalStrategyProperty = function validateLocalStrategyProperty(property){
  return ((this.provider != 'local' && !this.updated) || property.length);
};

const validateLocalStrategyEmail = function validateLocalStrategyEmail(email) {
 return ((this.provider !== 'local' && !this.updated) || sequelize.Validator.isEmail(email, { require_tld: false }));
};

const validateUsername = function validateUsername(username){
  const usernameRegex = /^(?=[\w.-]+$)(?!.*[._-]{2})(?!\.)(?!.*\.$).{3,34}$/;
  return (this.provider != 'local' || ( username && usernameRegex.test(username) && config.illegalUsernames.indexOf(username) < 0 ));
};

export = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 50],
        /*isIn: {
          args: [['en']],
          msg: 'First name must be in English'
        },*/
        isAlphanumeric: {
          msg: 'Only Alphanumeric allowed'
        },
        validateLocalStrategyProperty: validateLocalStrategyProperty
      },
      comment: "First name of user",      
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 50],
        isAlphanumeric: {
          msg: 'Only Alphanumeric allowed'
        },
        validateLocalStrategyProperty
      },
      comment: "Last name of user"
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        validateUsername: validateUsername
      },
      comment: 'The user who created the comment'
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Please provide a valid email address'
        },
      },
      comment: 'Users email address'
    },
    roles: {
      type: DataTypes.ENUM,
      values: ['user', 'admin'],
      defaultValue: 'user',
      comment: 'Users role'
    },
    password: {
      type: DataTypes.STRING,
      defaultValue: '',
      allowNull: true,
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: true
    },
    profileImageURL: {
      type: DataTypes.STRING,
      defaultValue: 'modules/users/client/img/profile/default.png'
    },
    // providerData: {},
    // additionalProvidersData: {},
    updated: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created: {
      type: DataTypes.DATE,
      defaultValue: Date.now
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    classMethods: {
      associate: function(models) {
        User.belongsTo(models.Task, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: false
          }
        });
      },
    },
    hooks: {
      beforeSave(model){
        if (model.dataValues.password && model.changed('password')) {
          model.dataValues.salt = crypto.randomBytes(16).toString('base64');
          model.dataValues.password = model.hashPassword(model.dataValues.password);
        }
      },
      beforeValidate(model){
        if (model.dataValues.provider === 'local' && model.dataValues.password && model.changed('password')) {
          const result = owasp.test(model.dataValues.password);
          if (result.errors.length) {
            const error = results.errors.join(' ');
            // this.invalidate('password', error);
            throw new Error(`${error}`);
          }
        }
      },
    }
  });
  
  User.prototype.hashPassword = function(password){
    if (this.salt && password) {
      return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64, 'SHA1').toString('base64');
    } else {
      return password;
    }
  };
  User.prototype.authenticate = function(password){
    return (this.password === this.hashPassword(password));
  }
  User.prototype.findUniqueUsername = function(username, suffix, callback) {
    let _this = this;
    let possibleUsername = username.toLowerCase() + (suffix || '');
    User.findOne({where: {
      username: possibleUsername
    }}).then((user) => {
      if(!user){
        callback(possibleUsername);  
      } else {
        return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
      }
    }).catch((err) => {
      callback(null);
    });
  };

  User.prototype.generateRandomPassphrase = function(){
    return new Promise(function (resolve, reject) {
      let password = '';
      let repeatingCharacters = new RegExp('(.)\\1{2,}', 'g');

      // iterate until the we have a valid passphrase
      // NOTE: Should rarely iterate more than once, but we need this to ensure no repeating characters are present
      while (password.length < 20 || repeatingCharacters.test(password)) {
        // build the random password
        password = generatePassword.generate({
          length: Math.floor(Math.random() * (20)) + 20, // randomize length between 20 and 40 characters
          numbers: true,
          symbols: false,
          uppercase: true,
          excludeSimilarCharacters: true
        });

        // check if we need to remove any repeating characters
        password = password.replace(repeatingCharacters, '');
      }

      // Send the rejection back if the passphrase fails to pass the strength test
      if (owasp.test(password).errors.length) {
        reject(new Error('An unexpected problem occured while generating the random passphrase'));
      } else {
        // resolve with the validated passphrase
        resolve(password);
      }
    });
  };

  return User;
}
