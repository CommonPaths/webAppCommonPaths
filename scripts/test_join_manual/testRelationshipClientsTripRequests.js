const Sequelize = require('sequelize');
const { ClientProfileModel, TripRequestModel } = require('../models/index');

const { Op } = Sequelize;

// This tests Clients model relationship to TripRequests join table

const findAllWithClients = async () => {
  const clients = await ClientProfileModel.findAll({
    include: [{
      model: TripRequestModel,
    }],
  });
  console.log('All trip requests with their associated clients:', JSON.stringify(clients, null, 4));
};

const run = async () => {
  await findAllWithClients();
  await process.exit();
};

run();
