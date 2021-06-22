const knex = require("../db/connection");

function list(reservation_date) {
  return knex("reservations").where(function(){
    this.where('status', '<>','finished').where({reservation_date})
  }).orderBy("reservation_time", "asc");
}

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

function create(reservation) {
  return knex("reservations")
    .insert({ ...reservation }, "*")
    .then((createdRecord) => createdRecord[0]);
}

function read(reservation_id) {
  return knex("reservations").where({ reservation_id }).first();
}

function update(reservation) {
  return knex("reservations")
    .where({ reservation_id: reservation.reservation_id })
    .update({ ...reservation}, "*")
    .then((updatedRecord) => updatedRecord[0]);
}

module.exports = { list, create, read, update, search };
