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
  const { table_name = null, capacity = null } = data;
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
  const { data = {} } = req.body;
  const table_id = Number(req.params.table_id);
  const params = ["reservation_id"];
  const { reservation_id = null } = data;
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
  const findReservation = await service.findReservation(reservation_id);
  const findTable = await service.read(table_id);

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
  if (findTable.reservation_id !== null) {
    return next({ status: 400, message: `table is occupied` });
  }
  next();
}

async function update(req, res, next) {
  res.json({ data: await service.update(req.body.data) });
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
  await service.delete(findTable.table_id);
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
