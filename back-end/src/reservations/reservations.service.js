const knex = require("../db/connection");

function list(reservation_date) {
  return knex("reservations")
    .where({ reservation_date })
    .orderBy("reservation_time", "asc");
}

function create(reservation) {
  return knex("reservations")
    .insert({ ...reservation }, "*")
    .then((createdRecord) => createdRecord[0]);
}

module.exports = { list, create };
