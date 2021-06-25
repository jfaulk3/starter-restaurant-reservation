function isTableValid({ data: { table_name, capacity } }) {
  const errors = [];
  if (table_name.length <= 1) {
    errors.push("table_name must be more than one character.");
  }
  if (isNaN(capacity) || capacity <= 0) {
    errors.push("capacity must be a number greater than 0.");
  }
  return errors;
}

export default isTableValid;
