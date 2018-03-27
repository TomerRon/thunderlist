'use strict';
module.exports = (sequelize, DataTypes) => {
  var Task = sequelize.define('Task', {
    content: DataTypes.STRING,
    done: DataTypes.BOOLEAN
  });
  
  Task.associate = function(models) {
    Task.belongsTo(models.List, {foreignKey: 'listId'});
  }
  
  return Task;
};