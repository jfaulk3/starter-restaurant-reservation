import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import isTableValid from "../validations/isTableValid";

function NewTables() {
  const history = useHistory();
  const [tableErrors, setErrors] = useState([]);

  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
  const [inputs, setInputs] = useState({
    table_name: "",
    capacity: 0,
  });
  let { table_name, capacity } = inputs;
  const onChange = ({ target: { name, value } }) => {
    setInputs({ ...inputs, [name]: value });
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
    capacity = Number(capacity);
    try {
      const body = {
        data: {
          table_name,
          capacity,
        },
      };
      if (addErrors(isTableValid(body)) === 0) {
        await fetch(`${API_BASE_URL}/tables`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        history.push("/dashboard");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <React.Fragment>
      <div className="new-error">
        <h2 className="text-center">Add a new table</h2>
        {tableErrors.map((error) => {
          return (
            <p key={error} className="alert alert-danger">
              {error}
            </p>
          );
        })}

        <form onSubmit={onSubmitForm}>
          <input
            type="text"
            name="table_name"
            placeholder="table_name"
            className="form-control w-50 mx-auto"
            value={table_name}
            onChange={(e) => onChange(e)}
          />
          <input
            type="number"
            name="capacity"
            placeholder="capacity"
            className="form-control w-50 mx-auto"
            value={capacity}
            min="0"
            onChange={(e) => onChange(e)}
          />
          <div className="d-flex flex-row justify-content-center">
            <button
              type="submit"
              className=" btn btn-primary form-control w-25"
            >
              Submit
            </button>
            <button
              onClick={cancelHandler}
              className=" btn btn-secondary form-control w-25"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
}

export default NewTables;
