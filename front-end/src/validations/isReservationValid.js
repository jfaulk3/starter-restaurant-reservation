function isReservationValid({ data: { reservation_date, reservation_time } }) {
  const errors = [];
  const date = `${reservation_date} ${reservation_time} UTC-05:00`;
  //Error checking the date
  const curDate = new Date(date);
  const todayDate = Date.now();

  if (curDate < todayDate) {
    errors.push("Your reservation date must be in the future.");
  }

  if (curDate.getUTCDay() === 2) {
    //According to documentation, 2 represents tuesday.
    errors.push("The restaurant is closed this day.");
  }

  //Error checking the time
  const businessOpen = new Date(date);
  const businessEndRes = new Date(date);
  const businessClose = new Date(date);

  businessOpen.setHours(10, 30, 0); // 10:30 AM
  businessEndRes.setHours(21, 30, 0); // 9:30 pm
  businessClose.setHours(22, 30, 0); // 10:30 pm

  const [hours, minutes] = reservation_time.split(":");
  curDate.setHours(hours, minutes);

  if (curDate.getTime() < businessOpen.getTime()) {
    errors.push("The reservation time is before open time.");
  }
  if (curDate.getTime() > businessClose.getTime()) {
    errors.push("The reservation time is after closing time.");
  }
  if (curDate.getTime() > businessEndRes.getTime()) {
    errors.push("The reservation time is too close to closing time.");
  }
  return errors;
}

export default isReservationValid;
