'use strict';

// /** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return await queryInterface.bulkInsert('Spots', [
      {
        ownerId: 1,
        address: '111 Happy Place',
        city: 'McDonalds',
        state: 'CA',
        country: 'United States',
        lat: 52.61194,
        lng: 50.94891,
        name: 'Nice Place',
        description: 'The best place a person could ever stay.',
        price: 999.99
      },
      {
        ownerId: 2,
        address: '222 Happy Place',
        city: 'Los Angeles',
        state: 'CA',
        country: 'United States',
        lat: 55.75296,
        lng: 141.83534,
        name: 'Good Place',
        description: 'A hallmark location of where a person should stay.',
        price: 500.00
      },
      {
        ownerId: 3,
        address: '333 Happy Place',
        city: 'New York City',
        state: 'NY',
        country: 'United States',
        lat: 26.50293,
        lng: 177.61798,
        name: 'Superb Place',
        description: 'A place for super people.',
        price: 700.00
      },
      {
        ownerId: 1,
        address: '444 Happy Place',
        city: 'New York City',
        state: 'NY',
        country: 'United States',
        lat: 57.50293,
        lng: 100.61798,
        name: 'Wonderful Place',
        description: 'Stand here and wonder.',
        price: 200.00
      },
      {
        ownerId: 2,
        address: '555 Happy Place',
        city: 'San Francisco',
        state: 'CA',
        country: 'United States',
        lat: 37.50293,
        lng: 122.61798,
        name: 'A Place',
        description: 'This is one place',
        price: 350.00
      },
      {
        ownerId: 3,
        address: '666 Happy Place',
        city: 'San Jose',
        state: 'CA',
        country: 'United States',
        lat: 37.3387,
        lng: 121.8853,
        name: 'Place',
        description: 'This is Place Jr.',
        price: 750.00
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return await queryInterface.bulkDelete('Spots', {
      name: { [Op.in]: ['Nice Place', 'Good Place', 'Superb Place'] }
    })
  }
};
