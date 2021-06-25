import { Link } from "react-router-dom";
import { listReservations, cancelReservation } from "../utils/api";

function ReservationList({ reservations, date, setReservations = null }) {
  async function deleteHandler({ target: { value } }) {
    try {
      if (
        window.confirm(
          "Do you want to cancel this reservation? This cannot be undone."
        )
      ) {
        const abortController = new AbortController();
        await cancelReservation(value, abortController.signal).catch((error) =>
          console.error(error)
        );

        //Refresh list
        await listReservations({ date }, abortController.signal)
          .then((reservations) => {
            setReservations(reservations);
          })
          .catch(console.log);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return reservations.map((reservation) => {
    return (
      <div key={reservation.reservation_id} className="my-4">
        <div className="row m-0 p-0">
          <div className="col">{reservation.first_name}</div>
          <div className="col"> {reservation.last_name}</div>
          <div className="col"> {reservation.mobile_number}</div>
          <div className="col"> {reservation.reservation_date}</div>
          <div className="col"> {reservation.reservation_time}</div>
          <div
            className="col"
            data-reservation-id-status={reservation.reservation_id}
          >
            {reservation.status || "booked"}
          </div>
          {reservation.status === "booked" && (
            <Link
              className="btn btn-primary col col-1"
              to={`/reservations/${reservation.reservation_id}/edit`}
            >
              Edit
            </Link>
          )}
          {reservation.status === "booked" && (
            <Link
              className="btn btn-secondary col col-1"
              to={`/reservations/${reservation.reservation_id}/seat`}
              href={`/reservations/${reservation.reservation_id}/seat`}
            >
              Seat
            </Link>
          )}
          {reservation.status === "booked" && (
            <button
              onClick={deleteHandler}
              value={reservation.reservation_id}
              href={`/reservations/${reservation.reservation_id}/edit`}
              data-reservation-id-cancel={reservation.reservation_id}
              className="btn btn-primary col col-1"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    );
  });
}

export default ReservationList;
