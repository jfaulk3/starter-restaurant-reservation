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

function read(reservation_id) {
  return knex("reservations").where({ reservation_id }).first();
}

module.exports = { list, create, read };
