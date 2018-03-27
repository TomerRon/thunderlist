'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
        'Lists',
        'userId', {
          type: Sequelize.INTEGER,
          references: {
            model: 'Users',
            key: 'id'
          },
          onDelete: 'cascade'
        }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Lists', 'userId');
  }
};