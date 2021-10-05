const Sequelize = require('sequelize');
const path = require('path');
const fs = require('fs');

const env = process.env.NODE_ENV || 'development';
// eslint-disable-next-line import/no-dynamic-require
const config = require(`${__dirname}/../config/config.json`)[env];
const basename = path.basename(__filename);

const dbs = {};

const buildSequilizersFromConfig = () => {
  Object.keys(config.databases).forEach((database) => {
    const dbConfig = config.databases[database];
    dbs[database] = new Sequelize(dbConfig.database,
      dbConfig.username,
      dbConfig.password,
      { host: dbConfig.host, dialect: dbConfig.dialect });
  });
};

const addModelsToConnections = (file) => {
  Object.keys(dbs).forEach((database) => {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const model = require(path.join(__dirname + '/tenants', file))(dbs[database], Sequelize.DataTypes);
    dbs[database][model.name] = model;
  });
};

const sequelizeModels = () => {
  fs
    .readdirSync(__dirname + '/tenants')
    .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
    .forEach((file) => {
      if (file !== 'index.js') {
        addModelsToConnections(file);
      }
    });
};

const associateModels = () => {
  Object.keys(dbs).forEach((database) => {
    Object.keys(dbs[database].models).forEach((modelName) => {
      const model = dbs[database].models[modelName];
      if (model.associate) {
        dbs[database][modelName].associate(dbs[database]);
      }
    });
  });
};

buildSequilizersFromConfig();
sequelizeModels();
associateModels();

module.exports = dbs;
