'use strict';
const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const attributes = {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: null,
        primaryKey: true,
        field: "id",
        autoIncrement: true
      },
      pathwayItinerary: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "pathwayItinerary",
        autoIncrement: false
      },
      itineraryInstructionLegs: {
        type: DataTypes.ARRAY(DataTypes.JSON),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "itineraryInstructionLegs",
        autoIncrement: false
      },
      tripDurationTime: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "tripDurationTime",
        autoIncrement: false
      },
      selectedItinNumber: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "selectedItinNumber",
        autoIncrement: false
      },
      pathwayCompleteDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "pathwayCompleteDate",
        autoIncrement: false
      },
      priority: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "priority",
        autoIncrement: false
      },
      status: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "status",
        autoIncrement: false
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "notes",
        autoIncrement: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
       },
       updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
       },
       deletedAt: {
        type: Sequelize.DATE
       },
    };
    await queryInterface.createTable('ADAPathways', attributes);  
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('ADAPathways');
  }
};
