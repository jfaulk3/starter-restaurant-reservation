import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import formatReservationDate from "../utils/format-reservation-date";
import { getReservation } from "../utils/api";
import isReservationValid from "../validations/isReservationValid";

function NewReservation({ setDate }) {
  const defaultInputs = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  };
  const history = useHistory();
  const { reservation_id } = useParams();
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
  const [reservation, setReservation] = useState({ ...defaultInputs });
  const {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  } = reservation;
  const onChange = ({ target: { name, value } }) => {
    setReservation({ ...reservation, [name]: value });
  };
  const [errors, setErrors] = useState([]);

  const cancelHandler = () => {
    history.goBack();
  };

  const addErrors = (errors) => {
    setErrors(errors);
    return errors.length;
  };

  const onSubmitForm = async (event) => {
    event.preventDefault();
    try {
      const body = {
        data: {
          first_name,
          last_name,
          mobile_number,
          reservation_date,
          reservation_time,
          people: Number(people),
        },
      };

      if (addErrors(isReservationValid(body)) === 0) {
        if (reservation_id) {
          await fetch(`${API_BASE_URL}/reservations/${reservation_id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
          setDate(reservation_date);
          history.goBack();
        } else {
          await fetch(`${API_BASE_URL}/reservations`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
          setDate(reservation_date);
          history.push("/dashboard");
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    const abortController = new AbortController();
    if (reservation_id) {
      getReservation(reservation_id, abortController.signal)
        .then(formatReservationDate)
        .then(setReservation);
    }

    return () => abortController.abort;
  }, [reservation_id]);

  return (
    <React.Fragment>
      <div className="new-reservation">
        <h2>Add a new reservation</h2>
        {errors.map((error) => {
          return (
            <p key={error} className="alert alert-danger">
              {error}
            </p>
          );
        })}

        <form onSubmit={onSubmitForm}>
          <input
            type="text"
            name="first_name"
            placeholder="first_name"
            value={first_name}
            onChange={(e) => onChange(e)}
          />
          <input
            type="text"
            name="last_name"
            placeholder="last_name"
            value={last_name}
            onChange={(e) => onChange(e)}
          />
          <input
            type="text"
            name="mobile_number"
            placeholder="mobile_number"
            value={mobile_number}
            onChange={(e) => onChange(e)}
          />
          <input
            type="date"
            name="reservation_date"
            placeholder="reservation_date"
            value={reservation_date}
            onChange={(e) => onChange(e)}
          />{" "}
          <input
            type="time"
            name="reservation_time"
            placeholder="reservation_time"
            value={reservation_time}
            onChange={(e) => onChange(e)}
          />{" "}
          <input
            type="number"
            name="people"
            placeholder="people"
            value={people}
            min="1"
            onChange={(e) => onChange(e)}
          />
          <button type="submit">Submit</button>
        </form>
        <button onClick={cancelHandler}>Cancel</button>
      </div>
    </React.Fragment>
  );
}

export default NewReservation;
