const Sequelize = require('sequelize');
const model = require('../../models/index');

const { Op } = Sequelize;

// This tests Officers assigned jobs from TripRequests, Desktop, Field and ADAPathways tables

const findAllWithOfficers = async () => {
  const jobs = await model.OfficerModel.findAll({
    include: [{ model: model.TripRequestModel },
      { model: model.DesktopReviewModel }, 
      { model: model.FieldReviewModel },
      { model: model.ADAPathwayModel }],
  });
  console.log('All trip requests with their associated clients:', JSON.stringify(jobs, null, 4));
  console.log(jobs[0]); // Single record request
  console.log(jobs[0].eMail); // test single attribute of single record request
  console.log(jobs[0].TripRequestModels[0].pName); // test joined attribute
};

const run = async () => {
  await findAllWithOfficers();
  await process.exit();
};

run();
