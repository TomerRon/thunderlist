'use strict';
var bcrypt   = require('bcrypt-nodejs');

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
  });
  
  User.associate = function(models) {
    User.hasMany(models.List, {foreignKey: 'userId', onDelete: 'CASCADE'});
  }
  
  User.generateHash = function generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  }
  User.prototype.validPassword = function validPassword(password) {
    return bcrypt.compareSync(password, this.password);
  }
  return User;
};