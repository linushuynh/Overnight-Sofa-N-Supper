'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

// /** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'SpotImages'
    return await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'https://www.eatthis.com/wp-content/uploads/sites/4/2020/05/mcdonalds-playplace.jpg?quality=82&strip=1&w=640',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://i.insider.com/56a78d4158c32394008b526e?width=700',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://www.kron4.com/wp-content/uploads/sites/11/2021/06/PopeyesExteriorGettyImages-643471694.jpg?w=2560&h=1440&crop=1',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://www.eatthis.com/wp-content/uploads/sites/4/2021/11/in-n-out-exterior.jpg?quality=82&strip=1',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://nypost.com/wp-content/uploads/sites/2/2022/08/chick-fil-a-menu-index.jpg?quality=75&strip=all',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://www.nrn.com/sites/nrn.com/files/Dominos-coronavirus-earnings_0_0.gif',
        preview: true
      },
      {
        spotId: 7,
        url: 'https://www.nrn.com/sites/nrn.com/files/Shake-Shack-Fishers-Ind.jpeg',
        preview: true
      },
      {
        spotId: 8,
        url: 'https://media-cdn.tripadvisor.com/media/photo-s/13/24/75/80/jack-in-the-box.jpg',
        preview: true
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    options.tableName = 'SpotImages'
    return await queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8] }
    })
  }
};
