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
      reviewLocation: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "reviewLocation",
        autoIncrement: false
      },
      reviewStartDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "reviewStartDate",
        autoIncrement: false
      },
      reviewCompleteDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "reviewCompleteDate",
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
    await queryInterface.createTable('DesktopReviews', attributes);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('DesktopReviews');
  }
};
