const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");
/**
 * List handler for reservation resources
 */
async function list(req, res, next) {
  if (req.query.date) {
    return res.json({
      data: await service.list(req.query.date),
    });
  } else if (req.query.mobile_number) {
    return res.json({ data: await service.search(req.query.mobile_number) });
  }
  next({ status: 400, message: "unknown query" });
}

async function isDataValid(req, res, next) {
  const { data = {} } = req.body;
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
    first_name = null,
    last_name = null,
    mobilePhone = null,
    reservation_date = null,
    reservation_time = null,
    people = null,
    status = "booked",
  } = data;
  for (const param of params) {
    if (!data[param]) {
      return next({ status: 400, message: `${param} is invalid` });
    }
  }
  const curDate = new Date(reservation_date);
  const todayDate = Date.now();
  if (isNaN(new Date(reservation_date))) {
    return next({ status: 400, message: "reservation_date is not valid." });
  }
  if (curDate < todayDate) {
    return next({
      status: 400,
      message: "reservation_date must be in the future.",
    });
  }
  if (curDate.getUTCDay() === 2) {
    //According to documentation, 2 represents tuesday.
    return next({
      status: 400,
      message: "The restaurant is closed this day.",
    });
  }
  if (!reservation_time.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/g)) {
    //Format must be HH:MM
    return next({ status: 400, message: "reservation_time is not valid." });
  }
  if (typeof people !== "number" || people < 0) {
    return next({
      status: 400,
      message: "people must be a non-negative number",
    });
  }
  const businessOpen = new Date(reservation_date);
  const businessClose = new Date(reservation_date);
  businessOpen.setHours(10, 30, 0); // 10:30 AM
  businessClose.setHours(21, 30, 0); // 9:30 pm

  const [hours, minutes] = reservation_time.split(":");
  curDate.setHours(hours, minutes);

  if (curDate < businessOpen || curDate > businessClose) {
    return next({
      status: 400,
      message: "reservation_time is not available.",
    });
  }
  res.locals.status = status;
  next();
}

function isReservationBooked(req, res, next) {
  const status = res.locals.status;
  if (status !== "booked") {
    return next({
      status: 400,
      message: `New reservations cannot have status of: ${status}`,
    });
  }
  next();
}

async function doesReservationExist(req, res, next) {
  const reservation_id = Number(req.params.reservation_id);
  const findReservation = await service.read(reservation_id);
  if (!findReservation) {
    return next({
      status: 404,
      message: `reservation id, ${reservation_id}, does not exist.`,
    });
  }
  res.locals.reservation = findReservation;
  next();
}

async function isStatusValid(req, res, next) {
  const validStatus = ["booked", "seated", "finished", "cancelled", "none"];
  const reservation_id = Number(req.params.reservation_id);
  const { status = {} } = req.body.data;
  if (!validStatus.includes(status)) {
    return next({ status: 400, message: `Status: ${status} is invalid.` });
  }
  const findReservation = await service.read(reservation_id);
  if (findReservation.status === "finished") {
    return next({
      status: 400,
      message: "a finished reservation cannot be updated",
    });
  }
  findReservation.status = status;
  res.locals.reservation = findReservation;
  next();
}

async function create(req, res) {
  res.status(201).json({ data: await service.create(req.body.data) });
}

function read(req, res) {
  res.json({ data: res.locals.reservation });
}

async function update(req, res) {
  const reservation = res.locals.reservation;
  const data = await service.update(reservation);
  res.json({ data });
}

async function resUpdate(req, res) {
  const reservation = req.body.data;
  reservation.reservation_id = Number(req.params.reservation_id);
  reservation.status = res.locals.reservation.status;
  res.json({ data: await service.update(reservation) });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    asyncErrorBoundary(isDataValid),
    isReservationBooked,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(doesReservationExist), read],
  update: [
    asyncErrorBoundary(doesReservationExist),
    asyncErrorBoundary(isStatusValid),
    asyncErrorBoundary(update),
  ],
  resUpdate: [
    asyncErrorBoundary(doesReservationExist),
    asyncErrorBoundary(isDataValid),
    asyncErrorBoundary(resUpdate),
  ],
};
