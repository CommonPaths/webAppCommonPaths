module.exports = {
  up: async (queryInterface) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const result = await queryInterface.sequelize.query(`INSERT INTO "Officers" (id, "firstName", "lastName", "idNumber", "eMail", "cognitoSub", "officerTitle", "officerRoles", "agency", "zoneZips", "active", "createdAt", "updatedAt", "deletedAt") VALUES
    (default, 'Ellen', 'R', 1, 'Ellen@example.com', '91091e95-5e90-4c5f-96cb-8859b5bbad39', NULL, 'reviewer', 'KCM', NULL, TRUE, '2020-07-27 14:36:42.692-05', '2020-07-27 14:36:42.692-05', NULL),
    (default, 'username', 'n', 2, 'username@example.com', '47dfa9c7-8352-46c8-92cc-a4e9ea0b23da', NULL, 'sys_admin', 'KCM', NULL, TRUE, '2020-07-27 14:36:42.692-05', '2020-07-27 14:36:42.692-05', NULL),
    (default, 'John', 'W', 3, 'John@example.com', 'a3350634-7558-4b52-a26f-a42b796813d9', NULL, 'admin', 'KCM', NULL, TRUE, '2020-07-27 14:36:42.692-05', '2020-07-27 14:36:42.692-05', NULL),
    (default, 'David', 'W', 4, 'David@example.com', 'b0ab67a2-3785-43ee-941e-aee7c9e7d68a', NULL, 'agency', 'KCM', NULL, TRUE, '2020-07-27 14:36:42.692-05', '2020-07-27 14:36:42.692-05', NULL);
     
  `);
    console.log(result);
  },
  down: async (queryInterface) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const result = await queryInterface.sequelize.query('TRUNCATE TABLE "Officers" RESTART IDENTITY CASCADE;');
    console.log(result);
  },
};
