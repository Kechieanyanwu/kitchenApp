'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  return queryInterface.sequelize.transaction(async (t) => {
    await queryInterface.bulkInsert(
      "Categories",
      [
        {
          category_name: "Dairy",
          date_created: "2023-11-08T14:14:01.390Z",
          date_updated: "2023-11-08T14:14:01.390Z",
        },
        {
          category_name: "Fruit",
          date_created: "2023-11-08T14:14:01.390Z",
          date_updated: "2023-11-08T14:14:01.390Z",
        },
        {
          category_name: "Bakery",
          date_created: "2023-11-08T14:14:01.390Z",
          date_updated: "2023-11-08T14:14:01.390Z",
        }
      ]);
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.bulkDelete("Categories", null, {})
    })
  }
};
