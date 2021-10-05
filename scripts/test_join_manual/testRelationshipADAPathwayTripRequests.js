const Sequelize = require('sequelize');
const model = require('../../models/index');

const { Op } = Sequelize;

// This tests ADAPathways to TripRequests to Clients table multiple join

const findAllWithADAPathways = async () => {
  const adaPathways = await model.ADAPathwayModel.findAll({
    include: [{ model: model.TripRequestModel, include: [{ model: model.ClientProfileModel }] },
      { model: model.OfficerModel }],
  });
  console.log('All trip requests with their associated clients:', JSON.stringify(adaPathways, null, 4));
  console.log(adaPathways[0]); // Single trip request
  console.log(adaPathways[0].pathwayItinerary); // test single attribute of single trip request 
  console.log(adaPathways[0].TripRequestModel.pName); // test joined attribute
};

const run = async () => {
  await findAllWithADAPathways();
  await process.exit();
};

run();
