const Sequelize = require('sequelize');
const model = require('../../models/index');

const { Op } = Sequelize;

// This tests TripRequests relation to Client, Officer, Desktop and Field review tables

const findAllWithTripRequests = async () => {
  const trips = await model.TripRequestModel.findAll({
    include: [{ model: model.ClientProfileModel },
      { model: model.OfficerModel },
      { model: model.DesktopReviewModel },
      { model: model.FieldReviewModel }],
  });
  console.log('All trip requests with their associated clients:', JSON.stringify(trips, null, 4));
  console.log(trips[0]); // Single trip request
  console.log(trips[0].pName); // test single attribute of single trip request 
  console.log(trips[0].ClientProfileModel.clientName); // test joined attribute
};

const run = async () => {
  await findAllWithTripRequests();
  await process.exit();
};

run();
