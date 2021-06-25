function isReservationValid({ data: { reservation_date, reservation_time } }) {
  const errors = [];

  //Error checking the date
  const curDate = new Date(`${reservation_date}T${reservation_time}`);
  const todayDate = Date.now();
  if (curDate < todayDate) {
    errors.push("Your reservation date must be in the future.");
  }

  if (curDate.getUTCDay() === 2) {
    //According to documentation, 2 represents tuesday.
    errors.push("The restaurant is closed this day.");
  }

  //Error checking the time
  const businessOpen = new Date();
  const businessClose = new Date();
  businessOpen.setHours(10, 30, 0); // 10:30 AM
  businessClose.setHours(21, 30, 0); // 9:30 pm

  const [hours, minutes] = reservation_time.split(":");
  curDate.setHours(hours, minutes);
  if (curDate < businessOpen) {
    errors.push("The reservation time is before open time.");
  }
  if (curDate > businessClose) {
    errors.push("The reservation time is too close to(or after) closing time.");
  }
  return errors;
}

export default isReservationValid;
