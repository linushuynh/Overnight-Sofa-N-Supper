'use strict';

// /** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return await queryInterface.bulkInsert('Bookings', [
      {
        spotId: 1,
        userId: 2,
        startDate: '2021-06-06',
        endDate: '2021-06-08'
      },
      {
        spotId: 3,
        userId: 1,
        startDate: '2021-12-11',
        endDate: '2021-06-08'
      },
      {
        spotId: 3,
        userId: 3,
        startDate: '2022-02-02',
        endDate: '2022-02-02'
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;

    return await queryInterface.bulkDelete('Bookings', {
      id: { [Op.in]: [1, 2, 3] }
    })
  }
};
