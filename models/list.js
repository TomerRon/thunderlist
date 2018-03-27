'use strict';
module.exports = (sequelize, DataTypes) => {
  var List = sequelize.define('List', {
    name: DataTypes.STRING,
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    }
  });
  
  List.associate = function(models) {
    List.hasMany(models.Task, {foreignKey: 'listId', onDelete: 'CASCADE'});
    List.belongsTo(models.User, {foreignKey: 'userId'});
  }
  
  return List;
};