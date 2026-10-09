"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "first_name", {
      type: Sequelize.STRING(100),
      allowNull: true, // Nullable initially so existing test users don't break
    });

    await queryInterface.addColumn("users", "last_name", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("users", "first_name");
    await queryInterface.removeColumn("users", "last_name");
  },
};
