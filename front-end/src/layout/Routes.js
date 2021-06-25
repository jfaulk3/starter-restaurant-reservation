import React, { useState } from "react";

import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NewReservation from "../reservations/NewReservation";
import NewTables from "../tables/NewTables";
import FindByNumber from "../FindByNumber/FindByNumber";
import Seat from "../reservations/Seat";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const search = useLocation().search;

  const [date, setDate] = useState(
    new URLSearchParams(search).get("date") || today()
  );
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations/new">
        <NewReservation setDate={setDate} />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/seat">
        <Seat />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/edit">
        <NewReservation setDate={setDate} />
      </Route>
      <Route exact={true} path="/tables/new">
        <NewTables />
      </Route>
      <Route exact={true} path="/search">
        <FindByNumber date={date} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={date} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
