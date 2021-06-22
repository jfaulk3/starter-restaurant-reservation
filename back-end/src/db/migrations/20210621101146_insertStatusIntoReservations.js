const { table } = require("../connection");

exports.up = function (knex) {
  return knex.schema.table("reservations", (table) => {
    table.string("status").defaultTo('none');
  });
};

exports.down = function (knex) {
  return knex.schema.table("reservations", (table) => {
    table.dropColumn("status");
  });
};
