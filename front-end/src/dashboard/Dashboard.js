import React, { useEffect, useState } from "react";
import { listReservations, listTables, deleteTable } from "../utils/api";
import { today, previous, next } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationList from "../reservations/ReservationList";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, setDate }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  useEffect(loadDashboard, [date]);
  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then((reservations) => {
        setReservations(reservations);
      })
      .catch(setReservationsError);
    setTablesError(null);
    listTables(abortController.signal)
      .then((tables) => {
        setTables(tables);
      })
      .catch(setTablesError);
    return () => abortController.abort();
  }

  async function deleteHandler({ target: { value } }) {
    try {
      if (
        window.confirm(
          "Is this table ready to seat new guests? This cannot be undone."
        )
      ) {
        const abortController = new AbortController();

        await deleteTable(value, abortController.signal).catch((error) =>
          console.error(error)
        );

        await listTables(abortController.signal)
          .then((tables) => {
            setTables(tables);
          })
          .catch(setTablesError);
        setReservationsError(null);
        listReservations({ date }, abortController.signal)
          .then((reservations) => {
            setReservations(reservations);
          })
          .catch(setReservationsError);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <main>
      <div className="row">
        <h1 className="col col-6">Dashboard</h1>
        <button
          className=" col col-2 btn btn-secondary m-2"
          onClick={() => {
            setDate(previous(date));
          }}
        >
          Previous Day
        </button>
        <button
          className=" col col-1 btn btn-success m-2"
          onClick={() => {
            setDate(today());
          }}
        >
          Today
        </button>
        <button
          className=" col col-2 btn btn-primary m-2"
          onClick={() => {
            setDate(next(date));
          }}
        >
          Next Day
        </button>
      </div>
      <div>
        <h4 className="m-5 text-center">Reservations for date</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <ReservationList
        reservations={reservations}
        date={date}
        setReservations={setReservations}
      />
      <ErrorAlert error={tablesError} />
      <h4 className="text-center mt-3">Tables</h4>
      <div className="row">
        <div className="col col-2"> Table Name</div>
        <div className="col col-2"> Capacity</div>
        <div className="col col-2">Occupied?</div>
      </div>
      {tables.map((table, index) => {
        return (
          <div
            key={table.table_id}
            className={`row m-0 p-3 bg-${
              index % 2 === 0 ? "success" : "light"
            }`}
            data-table-id-status={table.table_id}
          >
            <div className="col col-2"> {table.table_name}</div>
            <div className="col col-2"> {table.capacity}</div>
            <div className="col col-2">
              {table.reservation_id ? "Occupied" : "Free"}
            </div>
            <div className="col col-2">
              {table.reservation_id && (
                <button
                  onClick={deleteHandler}
                  value={table.table_id}
                  data-table-id-finish={table.table_id}
                  className="btn btn-primary"
                >
                  Finished
                </button>
              )}
            </div>
          </div>
        );
      })}
    </main>
  );
}

export default Dashboard;
