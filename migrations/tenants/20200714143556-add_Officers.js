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
      firstName: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "firstName",
        autoIncrement: false
      },
      lastName: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "lastName",
        autoIncrement: false
      },
      idNumber: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "idNumber",
        autoIncrement: false
      },
      eMail: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "eMail",
        autoIncrement: false
      },
      cognitoSub: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "cognitoSub",
        autoIncrement: false
      },
      officerTitle: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "officerTitle",
        autoIncrement: false
      },
      officerRoles: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "officerRoles",
        autoIncrement: false
      },
      agency: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "agency",
        autoIncrement: false
      },
      zoneZips: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "zoneZips",
        autoIncrement: false
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "active",
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
    await queryInterface.createTable('Officers', attributes);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('Officers');
  }
};
