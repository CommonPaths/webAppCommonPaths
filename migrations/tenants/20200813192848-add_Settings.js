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
      otpEndpoint: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "otpEndpoint",
        autoIncrement: false
      },
      osmEndpoint: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "osmEndpoint",
        autoIncrement: false
      },
      geocoderEndpoint: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "geocoderEndpoint",
        autoIncrement: false
      },
      osmUsername: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "osmUsername",
        autoIncrement: false
      },
      osmUserCipher: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "osmUserCipher",
        autoIncrement: false
      },
      bingMapKey: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "bingMapKey",
        autoIncrement: false
      },
      bbox: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "bbox",
        autoIncrement: false
      },
      cognitoRegion: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "cognitoRegion",
        autoIncrement: false
      },
      cognitoUserPoolId: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "cognitoUserPoolId",
        autoIncrement: false
      },
      cognitoTokenExpiration: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "cognitoTokenExpiration",
        autoIncrement: false
      },
      cognitoClientId: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "cognitoClientId",
        autoIncrement: false
      },
      cognitoClientId: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: 'cognitoClientId',
        autoIncrement: false,
      },
      s3AccessKeyId: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: 's3AccessKeyId',
        autoIncrement: false,
      },
      s3SecretAccessKey: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: 's3SecretAccessKey',
        autoIncrement: false,
      },
      s3BucketName: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: 's3BucketName',
        autoIncrement: false,
      },
      transportTileLayerKey: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: 'transportTileLayerKey',
        autoIncrement: false,
      },
      customTileLayerName: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: 'customTileLayerName',
        autoIncrement: false,
      },
      mapboxAccountName: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: 'mapboxAccountName',
        autoIncrement: false,
      },
      mapboxAccountStyleID: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: 'mapboxAccountStyleID',
        autoIncrement: false,
      },
      mapboxAccountKey: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: 'mapboxAccountKey',
        autoIncrement: false,
      },
      userSettings: {
        type: DataTypes.ARRAY(DataTypes.JSON),
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: "userSettings",
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
    await queryInterface.createTable('Settings', attributes);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('Settings');
  }
};