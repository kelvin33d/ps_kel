import * as crypto from 'crypto';

export = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    title: {
      type: DataTypes.STRING,
      comment: 'A title describing the task',
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'The user who created and owns this task'
    },
  }, {
      classMethods: {
        associate: function(models) {
          Task.hasMany(models.Comment);
        },
      },
      hooks:{
        beforeSave(model){
          // model.dataValues.title = this.options.hashPassword(`${model.dataValues.title}`, model);
          console.log(model.hashPassword(`${model.dataValues.title}`));
          // console.dir(model.changed('title'));
        }
      }
  });
  Task.prototype.hashPassword = function(password){
    if (this.title && password) {
      return crypto.pbkdf2Sync(password, new Buffer(this.username, 'base64'), 10000, 64, 'SHA1').toString('base64');
    }
  };
  Task.prototype.authenticate = function(password){
    return (this.password === this.hashPassword(password));
  };
  Task.prototype.gen = function(username, suffix, callback) {
    const _this = this;
    const possibleUsername = username.toLowerCase() + (suffix || '');
    Task.findOne({where:{title:possibleUsername}}).then((res) => {
      if (!res){
        callback(possibleUsername);
      } else {
       return _this.findUniqueUsername(username, (suffix || 0) + 1, callback); 
      }
    });
  };
  return Task;
}
