import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import isSeatValid from "../validations/isSeatValid";

function Seat() {
  const { reservation_id } = useParams();
  const history = useHistory();
  const [seatErrors, setErrors] = useState([]);
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
  const [tables, setTables] = useState([]);
  const [reservation, setReservation] = useState({});
  const [table, setTable] = useState({});

  const onChange = ({ target: { value } }) => {
    const table = tables.find(
      ({ table_id }) => Number(table_id) === Number(value)
    );
    setTable(table);
  };

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
      const [people, capacity, reservation_id] = [
        reservation.people,
        table.capacity,
        table.reservation_id,
      ];
      const body = { data: { reservation_id: reservation.reservation_id } };
      if (addErrors(isSeatValid(people, capacity, reservation_id)) === 0) {
        await fetch(`${API_BASE_URL}/tables/${table.table_id}/seat`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        history.push("/dashboard");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    async function getReservation() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/reservations/${reservation_id}`
        );
        const { data } = await response.json();
        setReservation(data);
      } catch (error) {
        console.error(error.message);
      }
    }
    async function getTables() {
      try {
        const response = await fetch(`${API_BASE_URL}/tables`);
        const { data } = await response.json();
        setTables(data);
      } catch (error) {
        console.error(error.message);
      }
    }
    getReservation();
    getTables();
  }, [reservation_id, API_BASE_URL]);
  const { last_name, people } = reservation;

  return (
    <div>
      <h1 className="text-center mx-auto py-4">Seat Reservation</h1>
      {seatErrors.map((error) => {
        return (
          <p key={error} className="alert alert-danger">
            {error}
          </p>
        );
      })}
      <form className="col-lg-10" onSubmit={onSubmitForm}>
        <h3 className="text-black text-center">
          {last_name} / Party Size: {people}
        </h3>
        <div className="form-group">
          <label htmlFor="select_table"></label>
          <select
            onChange={onChange}
            className="form-control w-50 mx-auto"
            id="select_table"
            name="table_id"
          >
            <option key={0} value={0}>
              --- Please select an option ---
            </option>
            {tables.map((table, index) => {
              return (
                <option key={index} value={table.table_id}>
                  {table.table_name} - {table.capacity}
                </option>
              );
            })}
          </select>
        </div>
        <div className="d-flex flex-row justify-content-center">
          <button className="btn btn-primary form-control w-25" type="submit">
            Submit
          </button>
          <button
            onClick={cancelHandler}
            className="btn btn-secondary form-control w-25"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default Seat;
