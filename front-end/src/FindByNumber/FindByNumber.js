import React, { useEffect, useState } from "react";
import ReservationList from "../reservations/ReservationList";
import { listNumbers } from "../utils/api";

function FindByNumber({ date }) {
  const [mobile_number, setMobileNumber] = useState("");
  const [reservations, setReservations] = useState([]);
  const [errors, setErrors] = useState([]);

  const onChange = ({ target: { value } }) => {
    setMobileNumber(value);
  };

  const onSubmitForm = (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    listNumbers(mobile_number, abortController.signal)
      .then(setReservations)
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (reservations.length <= 0) {
      setErrors(["No reservations found"]);
    } else {
      setErrors([]);
    }
  }, [reservations]);
  return (
    <React.Fragment>
      <h1>Search for Reservation by Number</h1>
      {errors.map((error) => {
        return (
          <p key={error} className="alert alert-danger">
            {error}
          </p>
        );
      })}
      <div>
        <form onSubmit={onSubmitForm}>
          <input
            className="w-50"
            type="text"
            name="mobile_number"
            placeholder="Enter a customer's phone number"
            value={mobile_number}
            onChange={(e) => onChange(e)}
          />
          <button type="submit">Find</button>
        </form>
      </div>
      <ReservationList
        reservations={reservations}
        date={date}
        setReservations={setReservations}
      />
    </React.Fragment>
  );
}
export default FindByNumber;
