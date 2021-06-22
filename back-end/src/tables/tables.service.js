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

async function update(table) {
  return await knex.transaction(async (trx) => {
    await trx("reservations as r")
      .join("tables as t", "r.reservation_id", "t.reservation_id")
      .update({ status: "seated" })
      .where({ reservation_id: table.reservation_id });
    
    return await trx("tables").update({ ...table }, "*").where({table_id: table.table_id});
  });
}

async function destroy(table) {
  try {
    await knex.transaction(async (trx) => {
      await trx("reservations as r")
        .join("tables as t", "r.reservation_id", "t.reservation_id")
        .update({ status: "finished" })
        .where({ reservation_id: table.reservation_id });

      await trx("tables")
        .update({ reservation_id: null }, "*")
        .where({ table_id: table.table_id });
    });
  } catch (error) {
    console.error(error);
  }
}
module.exports = {
  list,
  create,
  read,
  findReservation,
  update,
  delete: destroy,
};
