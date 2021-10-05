module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const attributes = {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: null,
        primaryKey: true,
        field: 'id',
        autoIncrement: true,
      },
      conditions: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: 'conditions',
        autoIncrement: false,
      },
      conditionsDesc: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: 'conditionsDesc',
        autoIncrement: false,
      },
      mobAids: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: 'mobAids',
        autoIncrement: false,
      },
      mobAidsDesc: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: 'mobAidsDesc',
        autoIncrement: false,
      },
      prefSpaceType: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: 'prefSpaceType',
        autoIncrement: false,
      },
      prefSpaceTypeDesc: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: 'prefSpaceTypeDesc',
        autoIncrement: false,
      },
      clientCode: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: 'clientCode',
        autoIncrement: false,
      },
      clientCodeDesc: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: null,
        primaryKey: false,
        field: 'clientCodeDesc',
        autoIncrement: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE
       },
    };
    await queryInterface.createTable('lookup_codes', attributes);
  },

  down: async (queryInterface) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('lookup_codes');
  },
};
