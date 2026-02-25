'use strict';
const { image } = require('../config/cloudinary');
const categoryData = require('../data/categories.json');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const formatCategory = categoryData.map(item => ({
      ...item,
      image_url: JSON.stringify(item.image_url)
    }));
    return queryInterface.bulkInsert('categories', categoryData, {});
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('categories', null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
