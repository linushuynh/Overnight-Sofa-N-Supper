'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users'
    return queryInterface.bulkInsert(options, [
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password'),
        firstName: 'Charlie',
        lastName: 'Brown'
      },
      {
        email: 'user2@user.io',
        username: 'ilovelinus',
        hashedPassword: bcrypt.hashSync('password2'),
        firstName: 'Sally',
        lastName: 'Brown'
      },
      {
        email: 'user3@user.io',
        username: 'snoopdawg',
        hashedPassword: bcrypt.hashSync('password3'),
        firstName: 'Snoopy',
        lastName: 'Dog'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    options.tableName = 'Users'
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'ilovelinus', 'snoopdawg'] }
    }, {});
  }
};
