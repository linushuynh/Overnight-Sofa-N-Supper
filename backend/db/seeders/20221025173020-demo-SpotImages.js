'use strict';

// /** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return await queryInterface.bulkInsert('SpotImages', [
      {
        spotId: 1,
        url: 'https://www.eatthis.com/wp-content/uploads/sites/4/2020/05/mcdonalds-playplace.jpg?quality=82&strip=1&w=640',
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
