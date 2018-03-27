'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
        'Tasks',
        'listId', {
          type: Sequelize.UUID,
          references: {
            model: 'Lists',
            key: 'id'
          }
        }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Tasks', 'listId');
  }
};