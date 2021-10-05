'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   const result = await queryInterface.sequelize.query(
     `INSERT INTO "Settings"(id, "otpEndpoint", "osmEndpoint", "geocoderEndpoint", "osmUsername", "osmUserCipher", "bingMapKey", "bbox", "createdAt", "updatedAt") VALUES
     (1, 'http://3.236.56.54:8080/otp/routers/kcm/plan','http://3.225.236.8:3000', 'https://nominatim.openstreetmap.org/search', 'mvt_pord', 'U2FsdGVkX1+fZo59m9EflUy29hgMFVF0R3dJmnvkR+M=', 'AuhiCJHlGzhg93IqUH_oCpl_-ZUrIE6SPftlyGYUvr9Amx5nzA-WqGcPquyFZl4L', '{-122.854352, 46.7288337, -120.906710, 48.299180}', '2020-10-27 10:26:14.818-05', '2020-10-27 10:26:14.818-05')
     `
     
   )
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const result = await queryInterface.sequelize.query('TRUNCATE TABLE "Settings" RESTART IDENTITY CASCADE;');
  }
};
