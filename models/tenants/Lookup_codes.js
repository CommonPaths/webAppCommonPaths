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
    conditions: {
      type: DataTypes.CHAR(255),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: 'conditions',
      autoIncrement: false,
    },
    conditionsDesc: {
      type: DataTypes.CHAR(255),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: 'conditionsDesc',
      autoIncrement: false,
    },
    mobAids: {
      type: DataTypes.CHAR(255),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: 'mobAids',
      autoIncrement: false,
    },
    mobAidsDesc: {
      type: DataTypes.CHAR(255),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: 'mobAidsDesc',
      autoIncrement: false,
    },
    prefSpaceType: {
      type: DataTypes.CHAR(255),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: 'prefSpaceType',
      autoIncrement: false,
    },
    prefSpaceTypeDesc: {
      type: DataTypes.CHAR(255),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: 'prefSpaceTypeDesc',
      autoIncrement: false,
    },
    clientCode: {
      type: DataTypes.CHAR(255),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: 'clientCode',
      autoIncrement: false,
    },
    clientCodeDesc: {
      type: DataTypes.CHAR(255),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: 'clientCodeDesc',
      autoIncrement: false,
    },
  };
  const options = {
    tableName: 'lookup_codes',
    comment: '',
    indexes: [],
    freezeTableName: true,
    paranoid: true,
    timestamps: true,
  };
  const LookupCodes = sequelize.define('LookupCodes', attributes, options);
  return LookupCodes;
};
