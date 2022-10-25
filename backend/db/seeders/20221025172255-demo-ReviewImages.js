'use strict';

// /** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return await queryInterface.bulkInsert('ReviewImages', [
      {
        reviewId: 1,
        url: 'image1forreview1@im.age'
      },
      {
        reviewId: 2,
        url: 'image2forreview2@im.age'
      },
      {
        reviewId: 3,
        url: 'image3forreview3@im.age'
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;

    return await queryInterface.bulkDelete('ReviewImages', {
      id: { [Op.in]: [1, 2, 3] }
    })
  }
};
