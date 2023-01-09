'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
// /** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Bookings'
    return await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 2,
        startDate: '2021-06-06',
        endDate: '2021-06-08'
      },
      {
        spotId: 2,
        userId: 3,
        startDate: '2021-12-11',
        endDate: '2021-06-08'
      },
      {
        spotId: 3,
        userId: 1,
        startDate: '2022-02-02',
        endDate: '2022-02-02'
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    options.tableName = 'Bookings'
    return await queryInterface.bulkDelete(options, {
      startDate: { [Op.in]: ['2021-06-06', '2021-12-11', '2022-02-02'] }
    })
  }
};
