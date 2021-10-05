const Sequelize = require('sequelize');
const model = require('../../models/index');

const { Op } = Sequelize;

// This tests Desktop Review to TripRequests to Field Review table multiple joins

/* const findAllWithTripsReviewed = async () => {
  const tripsreviewed = await model.TripRequestModel.findAll({
    include: [{ model: model.DesktopReviewModel }, { model: model.FieldReviewModel }],
    where: { [model.DesktopReviewModel]: { [Op.ne]: null } },
  }); */

const findAllWithTripsReviewed = async () => {
  const tripsreviewed = await model.TripRequestModel.findAll({
    include: [{ model: model.DesktopReviewModel, required: true }, { model: model.FieldReviewModel,required: true }],
  });

  console.log('All trip requests with their associated clients:', JSON.stringify(tripsreviewed, null, 4));
  // console.log(adaPathways[0]); // Single trip request
  // console.log(adaPathways[0].pathwayItinerary); // test single attribute of single trip request 
  // console.log(adaPathways[0].TripRequestModel.pName); // test joined attribute
};

const run = async () => {
  await findAllWithTripsReviewed();
  await process.exit();
};

run();
