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
        clientName: {
          type: DataTypes.TEXT,
          allowNull: true,
          defaultValue: null,
          comment: null,
          primaryKey: false,
          field: "clientName",
          autoIncrement: false
        },
        clientId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: null,
          comment: null,
          primaryKey: false,
          field: "clientId",
          unique: true,
          autoIncrement: false
        },
        conditions: {
          type: DataTypes.ARRAY(DataTypes.TEXT),
          allowNull: true,
          defaultValue: null,
          comment: null,
          primaryKey: false,
          field: "conditions",
          autoIncrement: false
        },
        mobAids: {
          type: DataTypes.ARRAY(DataTypes.TEXT),
          allowNull: true,
          defaultValue: null,
          comment: null,
          primaryKey: false,
          field: "mobAids",
          autoIncrement: false
        },
        prefSpaceType: {
          type: DataTypes.ARRAY(DataTypes.TEXT),
          allowNull: true,
          defaultValue: null,
          comment: null,
          primaryKey: false,
          field: "prefSpaceType",
          autoIncrement: false
        },
        btt: {
          type: DataTypes.TEXT,
          allowNull: true,
          defaultValue: null,
          comment: null,
          primaryKey: false,
          field: "btt",
          autoIncrement: false
        },
        clientStatus: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: null,
          comment: null,
          primaryKey: false,
          field: "clientStatus",
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
      await queryInterface.createTable('Clients', attributes);  
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('Clients');
  }
};
