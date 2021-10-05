const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const attributes = {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: true,
      field: 'id',
      autoIncrement: true,
    },
    clientName: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: 'clientName',
      autoIncrement: false,
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: 'clientId',
      unique: true,
      autoIncrement: false,
    },
    conditions: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: 'conditions',
      autoIncrement: false,
    },
    mobAids: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: 'mobAids',
      autoIncrement: false,
    },
    prefSpaceType: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: 'prefSpaceType',
      autoIncrement: false,
    },
    btt: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: 'btt',
      autoIncrement: false,
    },
    clientStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: 'clientStatus',
      autoIncrement: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: 'notes',
      autoIncrement: false,
    },
  };
  const options = {
    tableName: 'Clients',
    comment: '',
    indexes: [],
    freezeTableName: true,
    paranoid: true,
    timestamps: true,
  };

  const ClientProfileModel = sequelize.define('ClientProfileModel', attributes, options);

  ClientProfileModel.associate = (models) => {
    ClientProfileModel.hasMany(models.TripRequestModel, { foreignKey: 'clientsId' });
  };
  return ClientProfileModel;
};
