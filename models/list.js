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
    List.belongsTo(models.User, {foreignKey: 'userId', onDelete: 'CASCADE'});
  }
  
  return List;
};