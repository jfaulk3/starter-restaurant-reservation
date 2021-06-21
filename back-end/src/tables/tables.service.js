const knex = require("../db/connection");

function list() {
  return knex("tables").orderBy("table_name");
}

function create(table) {
  return knex("tables")
    .insert({ ...table }, "*")
    .then((createdRecord) => createdRecord[0]);
}

function read(table_id) {
  return knex("tables").where({ table_id }).first();
}

function findReservation(reservation_id) {
  return knex("reservations").where({ reservation_id }).first();
}

function update(table) {
  return knex("tables").update({ ...table }, "*");
}

function destroy(table_id) {
  return knex("tables")
    .update({ reservation_id: null }, "*")
    .where({ table_id });
}
module.exports = {
  list,
  create,
  read,
  findReservation,
  update,
  delete: destroy,
};
