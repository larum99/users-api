'use strict';

const users = require('../data/users');

module.exports.createUser = async (event) => {
  const body = event.body || event;
  const user = JSON.parse(typeof body === 'string' ? body : JSON.stringify(body));
  user.id = users.length + 1;
  users.push(user);
  return { statusCode: 201, body: JSON.stringify(user) };
};
