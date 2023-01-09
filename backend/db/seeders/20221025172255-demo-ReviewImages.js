'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

// /** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages'
    return await queryInterface.bulkInsert(options, [
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
    options.tableName = 'ReviewImages'
    return await queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['image1forreview1@im.age', 'image2forreview2@im.age', 'image3forreview3@im.age'] }
    })
  }
};
