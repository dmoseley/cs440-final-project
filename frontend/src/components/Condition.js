import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const Condition = props => {
  return (
    <div
      className="container shadow-sm"
      style={{
        padding: "20px",
        margin: "10px 0 10px 0",
        backgroundColor: "#dff2f5"
      }}
    >
      <div className="row">
        <div className="col-3">
          <label style={{ fontWeight: "bold", color: "#828485" }}>
            Attribute:
          </label>
          <select
            className="form-control"
            onChange={e =>
              props.updateConditionAttribute(props.id, e.target.value)
            }
          >
            <option value=""></option>
            {props.attributes.map(attribute => (
              <option key={attribute.value} value={attribute.value}>
                {attribute.display}
              </option>
            ))}
          </select>
        </div>
        <div className="col-3">
          <label style={{ fontWeight: "bold", color: "#828485" }}>Is:</label>
          <select
            className="form-control"
            onChange={e => props.updateConditionIs(props.id, e.target.value)}
          >
            <option value="exact">Exact Match</option>
            <option value="contains">Contains</option>
            <option value=">">{">"}</option>
            <option value="<">{"<"}</option>
            <option value=">=">{">="}</option>
            <option value="<=">{"<="}</option>
          </select>
        </div>
        <div className="col-3">
          <label style={{ fontWeight: "bold", color: "#828485" }}>Value:</label>
          <input
            className="form-control"
            onChange={e => props.updateConditionValue(props.id, e.target.value)}
          />
        </div>
        <div className="d-flex col-3 justify-content-center align-items-center">
          <button
            className="btn btn-danger"
            style={{
              fontWeight: "bold",
              fontSize: "14px",
              margin: "10px",
              width: "60%"
            }}
            onClick={() => props.deleteCondition(props.id)}
          >
            <FontAwesomeIcon style={{ marginRight: "5px" }} icon={faTrash} />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default Condition;
