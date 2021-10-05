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
    pathwayItinerary: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: 'pathwayItinerary',
      autoIncrement: false,
    },
    itineraryInstructionLegs: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: 'itineraryInstructionLegs',
      autoIncrement: false,
    },
    tripDurationTime: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: 'tripDurationTime',
      autoIncrement: false,
    },
    selectedItinNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: 'selectedItinNumber',
      autoIncrement: false,
    },
    pathwayCompleteDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: 'pathwayCompleteDate',
      autoIncrement: false,
    },
    priority: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: 'priority',
      autoIncrement: false,
    },
    status: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: 'status',
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
    tripRequestsId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: 'tripRequestsId',
      autoIncrement: false,
      references: {
        key: 'id',
        model: 'TripRequestModel',
      },
    },
    officersId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: 'officersId',
      autoIncrement: false,
      references: {
        key: 'id',
        model: 'OfficerModel',
      },
    },
  };
  const options = {
    tableName: 'ADAPathways',
    comment: '',
    indexes: [],
    freezeTableName: true,
    paranoid: true,
    timestamps: true,
  };

  const ADAPathwayModel = sequelize.define('ADAPathwayModel', attributes, options);

  ADAPathwayModel.associate = (models) => {
    ADAPathwayModel.belongsTo(models.TripRequestModel, { foreignKey: 'tripRequestsId' });
    ADAPathwayModel.belongsTo(models.OfficerModel, { foreignKey: 'officersId' });
  };

  return ADAPathwayModel;
};
