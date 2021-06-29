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
      <h1 className="text-center">Search for Reservation by Number</h1>
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
            type="text"
            name="mobile_number"
            placeholder="Enter a customer's phone number"
            className="form-control w-50 mx-auto"
            value={mobile_number}
            onChange={(e) => onChange(e)}
          />
          <div className="d-flex flex-row justify-content-center">
            <button
              type="submit"
              className=" btn btn-secondary form-control mx-auto w-50"
            >
              Find
            </button>
          </div>
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
