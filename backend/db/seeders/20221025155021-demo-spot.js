'use strict';

// /** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return await queryInterface.bulkInsert('Spots', [
      {
        ownerId: 1,
        address: '111 Happy Place',
        city: 'Houston',
        state: 'TX',
        country: 'United States',
        lat: 52.61194,
        lng: 50.94891,
        name: 'McDonalds',
        description: 'Old McDonald had a farm for this.',
        price: 999.99
      },
      {
        ownerId: 2,
        address: '222 Happy Place',
        city: 'Frankfort',
        state: 'Kentucky',
        country: 'United States',
        lat: 55.75296,
        lng: 141.83534,
        name: 'Kentucky Fried Chicken',
        description: 'We offer not just hospitality, but godly fried chicken!',
        price: 500.00
      },
      {
        ownerId: 3,
        address: '333 Happy Place',
        city: 'Baton Rouge',
        state: 'Lousiana',
        country: 'United States',
        lat: 26.50293,
        lng: 177.61798,
        name: 'Popeyes',
        description: 'We promise your eyes will not pop if you visit and stay with us.',
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
        name: 'In-N-Out',
        description: 'This location is seated outside of the city so you can go out as fast as you came in!',
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
        name: 'Chick-Fil-A',
        description: 'Staying with us guarantees amazing sauces',
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
        name: 'Dominos',
        description: 'We offer not just your favorite childhood board game but your favorite place to stay as well as free pizzas!',
        price: 750.00
      },
      {
        ownerId: 2,
        address: '777 Happy Place',
        city: 'Boston',
        state: 'Massachusetts',
        country: 'United States',
        lat: 37.3387,
        lng: 121.8853,
        name: 'Shake Shack',
        description: 'Our building foundation is so strong your shacks will be shook at night!',
        price: 1200.00
      },
      {
        ownerId: 3,
        address: '888 Happy Place',
        city: 'Colombus',
        state: 'Ohio',
        country: 'United States',
        lat: 37.3387,
        lng: 121.8853,
        name: 'Jack in the Box',
        description: 'Curly fries for everyone who stays with us!',
        price: 750.00
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return await queryInterface.bulkDelete('Spots', {
      name: { [Op.in]: ['McDonalds', 'KFC', 'Popeyes', 'In-N-Out', 'Chick-Fil-A', 'Dominos', 'Shake Shack', 'Jack in the Box'] }
    })
  }
};
