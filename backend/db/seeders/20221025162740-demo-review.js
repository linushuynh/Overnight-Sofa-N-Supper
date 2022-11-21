'use strict';


module.exports = {
  async up (queryInterface, Sequelize) {
    return await queryInterface.bulkInsert('Reviews', [
      {
        spotId: 1,
        userId: 2,
        review: "A nice place, basically a classic",
        stars: 4
      },
      {
        spotId: 2,
        userId: 3,
        review: "This was advertised well but ultimately a letdown.",
        stars: 2
      },
      {
        spotId: 2,
        userId: 2,
        review: "I don't know what others are saying but this was kentucky fried CRISPY!!!",
        stars: 2
      },
      {
        spotId: 3,
        userId: 2,
        review: "It was okay",
        stars: 3
      },
      {
        spotId: 4,
        userId: 3,
        review: "Oh yes, more please!",
        stars: 5
      },
      {
        spotId: 5,
        userId: 3,
        review: "It was not saucy enough",
        stars: 2
      },
      {
        spotId: 6,
        userId: 3,
        review: "Bam bam bam I felt like a domino staying here",
        stars: 2
      },
      {
        spotId: 8,
        userId: 3,
        review: "Bro there's ghosts in here",
        stars: 1
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return await queryInterface.bulkDelete('Reviews', {
      review: { [Op.in]: ["A nice place, basically a classic", "This was advertised well but ultimately a letdown.", "I don't know what others are saying but this was kentucky fried CRISPY!!!", "It was okay", "Oh yes, more please!", "It was not saucy enough", "Bam bam bam I felt like a domino staying here", "Bro there's ghosts in here"] }
    })
  }
};
