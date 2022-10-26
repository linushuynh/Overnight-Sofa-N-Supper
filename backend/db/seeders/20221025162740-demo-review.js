'use strict';


module.exports = {
  async up (queryInterface, Sequelize) {
    return await queryInterface.bulkInsert('Reviews', [
      {
        spotId: 1,
        userId: 3,
        review: "This was truly a nice place indeed.",
        stars: 4
      },
      {
        spotId: 2,
        userId: 3,
        review: "This was advertised well but ultimately a letdown.",
        stars: 2
      },
      {
        spotId: 3,
        userId: 3,
        review: "Not enough super people.",
        stars: 3
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return await queryInterface.bulkDelete('Reviews', {
      review: { [Op.in]: ["This was truly a nice place indeed.", "This was advertised well but ultimately a letdown.", "Not enough super people."] }
    })
  }
};
