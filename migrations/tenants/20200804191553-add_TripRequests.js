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
      bookingId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "bookingId",
        unique: true,
        autoIncrement: false
      },
      trips: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "trips",
        autoIncrement: false,
      },
      pName: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "pName",
        autoIncrement: false
      },
      pAddr: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "pAddr",
        autoIncrement: false
      },
      pUnit: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "pUnit",
        autoIncrement: false
      },
      pZip: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "pZip",
        autoIncrement: false
      },
      pCity: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "pCity",
        autoIncrement: false
      },
      pState: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "pState",
        autoIncrement: false
      },
      pLat: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: 'pLat',
        autoIncrement: false,
      },
      pLon: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: 'pLon',
        autoIncrement: false,
      },
      pLatGeocode: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: 'pLatGeocode',
        autoIncrement: false,
      },
      pLonGeocode: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: 'pLonGeocode',
        autoIncrement: false,
      },
      proximityQuery: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: 'proximityQuery',
        autoIncrement: false,
      },
      dName: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "dName",
        autoIncrement: false
      },
      dAddr: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "dAddr",
        autoIncrement: false
      },
      dUnit: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "dUnit",
        autoIncrement: false
      },
      dZip: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "dZip",
        autoIncrement: false
      },
      dCity: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "dCity",
        autoIncrement: false
      },
      dState: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "dState",
        autoIncrement: false
      },
      dLat: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: 'dLat',
        autoIncrement: false,
      },
      dLon: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: 'dLon',
        autoIncrement: false,
      },
      dLatGeocode: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: 'dLatGeocode',
        autoIncrement: false,
      },
      dLonGeocode: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: 'dLonGeocode',
        autoIncrement: false,
      },
      DateAdded: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "DateAdded",
        autoIncrement: false
      },
      daysOfWeekRequested: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "daysOfWeekRequested",
        autoIncrement: false
      },
      tripTime: {
        type: DataTypes.TIME,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "tripTime",
        autoIncrement: false
      },
      appointmentTime: {
        type: DataTypes.TIME,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "appointmentTime",
        autoIncrement: false
      },
      tripRequestType: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "tripRequestType",
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
      dateCompleted: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "dateCompleted",
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
    await queryInterface.createTable('TripRequests', attributes);  
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('TripRequests');
  }
};
