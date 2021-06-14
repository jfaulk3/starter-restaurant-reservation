const { as } = require("../db/connection");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");
/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const { date } = req.query;
  res.json({
    data: await service.list(date),
  });
}

async function isDataValid(req, res, next) {
  const { data } = req.body;
  const params = [
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
  ];
  if (!data) {
    return next({
      status: 400,
      message: "Request body is empty or improperly formatted.",
    });
  }
  const {
    first_name = "",
    last_name = "",
    mobilePhone = "",
    reservation_date = "",
    reservation_time = "",
    people = null,
  } = data;
  for (const param of params) {
    if (!data[param]) {
      return next({ status: 400, message: `${param} is invalid` });
    }
  }
  if (isNaN(new Date(reservation_date))) {
    return next({ status: 400, message: "reservation_date is not valid." });
  }
  if (!reservation_time.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/g)) {
    return next({ status: 400, message: "reservation_time is not valid." });
  }
  if (typeof people !== "number") {
    return next({ status: 400, message: "people must be a number" });
  }
  next();
}

async function create(req, res) {
  res.status(201).json({ data: await service.create(req.body.data) });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [asyncErrorBoundary(isDataValid), asyncErrorBoundary(create)],
};
