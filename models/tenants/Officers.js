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
    firstName: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: 'firstName',
      autoIncrement: false,
    },
    lastName: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: 'lastName',
      autoIncrement: false,
    },
    idNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: 'idNumber',
      autoIncrement: false,
    },
    eMail: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: 'eMail',
      autoIncrement: false,
    },
    cognitoSub: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: 'cognitoSub',
      autoIncrement: false,
    },
    officerTitle: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: 'officerTitle',
      autoIncrement: false,
    },
    officerRoles: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: 'officerRoles',
      autoIncrement: false,
    },
    agency: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: 'agency',
      autoIncrement: false,
    },
    zoneZips: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: 'zoneZips',
      autoIncrement: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: 'active',
      autoIncrement: false,
    },
  };
  const options = {
    tableName: 'Officers',
    comment: '',
    indexes: [],
    freezeTableName: true,
    paranoid: true,
    timestamps: true,
  };
  const OfficerModel = sequelize.define('OfficerModel', attributes, options);
  OfficerModel.associate = (models) => {
    OfficerModel.hasMany(models.TripRequestModel, { foreignKey: 'officersId' });
    OfficerModel.hasMany(models.DesktopReviewModel, { foreignKey: 'officersId' });
    OfficerModel.hasMany(models.FieldReviewModel, { foreignKey: 'officersId' });
    OfficerModel.hasMany(models.ADAPathwayModel, { foreignKey: 'officersId' });
  };
  return OfficerModel;
};
