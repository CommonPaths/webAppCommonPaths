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
    reviewLocation: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: 'reviewLocation',
      autoIncrement: false,
    },
    reviewStartDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: 'reviewStartDate',
      autoIncrement: false,
    },
    reviewCompleteDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: 'reviewCompleteDate',
      autoIncrement: false,
    },
    mapNoteId: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: 'mapNoteId',
      autoIncrement: false,
    },
    URLMapNote: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: 'URLMapNote',
      autoIncrement: false,
    },
    fieldPicturesMeta: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: 'fieldPicturesMeta',
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
    tableName: 'FieldReviews',
    comment: '',
    indexes: [],
    freezeTableName: true,
    paranoid: true,
    timestamps: true,
  };

  const FieldReviewModel = sequelize.define('FieldReviewModel', attributes, options);

  FieldReviewModel.associate = (models) => {
    FieldReviewModel.belongsTo(models.TripRequestModel, { foreignKey: 'tripRequestsId' });
    FieldReviewModel.belongsTo(models.OfficerModel, { foreignKey: 'officersId' });
  };

  return FieldReviewModel;
};
