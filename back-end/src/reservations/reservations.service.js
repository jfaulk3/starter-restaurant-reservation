const knex = require("../db/connection");

function list(reservation_date) {
  return knex("reservations").where(function(){
    this.where('status', '<>','finished').where({reservation_date})
  }).orderBy("reservation_time", "asc");
}

function create(reservation) {
  return knex("reservations")
    .insert({ ...reservation }, "*")
    .then((createdRecord) => createdRecord[0]);
}

function read(reservation_id) {
  return knex("reservations").where({ reservation_id }).first();
}

function update(reservation, status) {
  return knex("reservations")
    .where({ reservation_id: reservation.reservation_id })
    .update({ ...reservation, status }, "*")
    .then((updatedRecord) => updatedRecord[0]);
}

module.exports = { list, create, read, update };
