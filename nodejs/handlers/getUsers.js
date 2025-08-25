'use strict';

const users = require('../data/users');

module.exports.getUsers = async () => ({
  statusCode: 200,
  body: JSON.stringify(users)
});
