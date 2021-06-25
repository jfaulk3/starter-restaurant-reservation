const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");
/**
 * List handler for reservation resources
 */
async function list(req, res) {
  res.json({
    data: await service.list(),
  });
}

async function isDataValid(req, res, next) {
  const { data = {} } = req.body;
  const params = ["table_name", "capacity"];
  if (!data) {
    return next({
      status: 400,
      message: "Request body is empty or improperly formatted.",
    });
  }
  for (const param of params) {
    if (!data[param]) {
      return next({ status: 400, message: `${param} is invalid` });
    }
  }
  const { table_name, capacity } = data;

  if (table_name.length <= 1) {
    return next({
      status: 400,
      message: `table_name must be more than one character.`,
    });
  }
  if (isNaN(capacity) || capacity <= 0) {
    return next({
      status: 400,
      message: `capacity must be a number greater than 0.`,
    });
  }
  next();
}

async function create(req, res) {
  res.status(201).json({ data: await service.create(req.body.data) });
}

async function isSeatReservationValid(req, res, next) {
  const { data } = req.body;
  const table_id = Number(req.params.table_id);
  const params = ["reservation_id"];
  if (!data) {
    return next({
      status: 400,
      message: "Request body is empty or improperly formatted.",
    });
  }
  for (const param of params) {
    if (!data[param]) {
      return next({ status: 400, message: `${param} is invalid` });
    }
  }
  const findTable = await service.read(table_id);
  if (findTable.reservation_id !== null) {
    return next({ status: 400, message: `table is occupied` });
  }
  const { reservation_id } = data;
  const findReservation = await service.findReservation(reservation_id);
  if (!findReservation) {
    return next({
      status: 404,
      message: `Reservation id ,${reservation_id}, does not exist.`,
    });
  }
  if (findReservation.people > findTable.capacity) {
    return next({
      status: 400,
      message: `table capacity is less than the number of people in reservation`,
    });
  }
  if (findReservation.status === "seated") {
    return next({
      status: 400,
      message: `Reservation id, ${reservation_id} is already seated`,
    });
  }
  findTable.reservation_id = findReservation.reservation_id;
  res.locals.table = findTable;
  next();
}

async function update(req, res, next) {
  const table = res.locals.table;
  res.json({ data: await service.update(table) });
}

async function doesTableExist(req, res, next) {
  const table_id = Number(req.params.table_id);
  const findTable = await service.read(table_id);
  if (findTable) {
    res.locals.table = findTable;
    return next();
  }
  return next({ status: 404, message: `Table id, ${table_id} does not exist` });
}

async function destroy(req, res, next) {
  findTable = res.locals.table;
  if (findTable.reservation_id === null) {
    return next({ status: 400, message: `table is not occupied` });
  }
  await service.delete(findTable);
  res.sendStatus(200);
}
module.exports = {
  list: asyncErrorBoundary(list),
  create: [asyncErrorBoundary(isDataValid), asyncErrorBoundary(create)],
  update: [
    asyncErrorBoundary(isSeatReservationValid),
    asyncErrorBoundary(update),
  ],
  delete: [asyncErrorBoundary(doesTableExist), asyncErrorBoundary(destroy)],
};
