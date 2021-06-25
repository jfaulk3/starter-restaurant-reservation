function isSeatValid(people, capacity, reservation_id) {
  const errors = [];
  if (reservation_id !== null) {
    errors.push("Table is occupied");
  }
  if (people > capacity) {
    errors.push(
      "table capacity is less than the number of people in reservation"
    );
  }
  return errors;
}

export default isSeatValid;
