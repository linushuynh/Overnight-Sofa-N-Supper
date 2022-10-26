'use strict';

// /** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return await queryInterface.bulkInsert('SpotImages', [
      {
        spotId: 1,
        url: 'image1forspot1@im.age',
        preview: true
      },
      {
        spotId: 2,
        url: 'image2forspot2@im.age',
        preview: true
      },
      {
        spotId: 3,
        url: 'image3forspot3@im.age',
        preview: true
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;

    return await queryInterface.bulkDelete('SpotImages', {
      url: { [Op.in]: ['image1forspot1@im.age', 'image2forspot2@im.age', 'image3forspot3@im.age'] }
    })
  }
};
