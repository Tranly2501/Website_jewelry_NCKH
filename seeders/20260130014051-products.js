'use strict';
const productData = require('../data/products.json');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
      // // lấy danh sách category thực tế trong database 
      // const categories = await queryInterface.sequelize.query(
      //   `SELECT id, name FROM categories;`,
      //   { type: queryInterface.sequelize.QueryTypes.SELECT }
      // );

      // // thực hiện tra cứu id theo category name
      // const catLookUp = {};
      // categories.forEach(items => {
      //   catLookUp[items.name] = items.id;
      // })

      //chuyển đổi dữ liệu
      const formatProduct = productData.map(p => {
        return {
          ...p,
          name: p.name,
          description: p.description,
          descriptionDetail: p.descriptionDetail,
          price: p.price,
          oldprice: p.oldprice,
          category_id: p.category_id || null,
          specification: JSON.stringify(p.specification),
          image_url: JSON.stringify(p.image_url),
          byturn: p.byturn,
          quantity: p.quantity,
          status: p.status,
          create_at: new Date(),
          update_at: new Date()
      }});
      return queryInterface.bulkInsert('products', formatProduct, {});
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

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('products', null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
