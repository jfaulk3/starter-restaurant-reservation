import React, { useState } from "react";
import { useHistory } from "react-router-dom";

function NewReservation() {
  const history = useHistory();
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
  const [inputs, setInputs] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  });
  const {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  } = inputs;
  const onChange = ({ target: { name, value } }) => {
    setInputs({ ...inputs, [name]: value });
  };

  const cancelHandler = () => {
    history.goBack();
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
          people,
        },
      };
      await fetch(`${API_BASE_URL}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <React.Fragment>
      <div className="new-reservation">
        <h2>Add new reservation</h2>
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
          <button>Submit</button>
        </form>
        <button onClick={cancelHandler}>Cancel</button>
      </div>
    </React.Fragment>
  );
}

export default NewReservation;
