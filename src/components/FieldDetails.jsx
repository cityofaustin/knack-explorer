import React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Badge from "react-bootstrap/Badge";
import BootstrapTable from "react-bootstrap/Table";
import MetadataContext from "./MetadataContext";

  
function findField(fields, key) {
  return fields.filter((field) => field.key === key)[0];
}

function fieldInfo(data) {
  return (
    <Row>
      <Col>
        <BootstrapTable striped bordered hover>
          <tbody>
            <tr>
              <td>Name</td>
              <td>{data.name}</td>
            </tr>
            <tr>
              <td>Key</td>
              <td>{data.key}</td>
                      </tr>
                      <tr>
              <td>Object</td>
                          <td><Link to={`/objects/${data.object_key}`}>{data.object_key}</Link></td>
            </tr>
            <tr>
              <td>Type</td>
              <td>{data.type}</td>
            </tr>
            <tr>
              <td>Required</td>
              <td>{data.required}</td>
            </tr>
            <tr>
              <td>Unique</td>
              <td>{data.unique}</td>
            </tr>
            <tr>
              <td>User</td>
              <td>{data.user}</td>
            </tr>
            <tr>
              <td>Conditional</td>
              <td>{data.conditional}</td>
            </tr>
            <tr>
              <td>Rules</td>
              <td>{data.rules}</td>
            </tr>
            <tr>
              <td>Validation</td>
              <td>{data.validation}</td>
            </tr>
          </tbody>
        </BootstrapTable>
      </Col>
    </Row>
  );
}

function FieldDetails(props) {
  const metadata = React.useContext(MetadataContext);

  const key = useRouteMatch("/fields/:key").params.key;
  if (!metadata) {
    return (
      <Row>
        <Col>
          <p>
            Metadata not loaded. Please go <a href="/">home</a>.
          </p>
        </Col>
      </Row>
    );
  }

  const data = findField(metadata.fields, key);

  return (
    <>
      <Row>
        <Col>
          <h2><Badge variant="info" className="text-monospace">Field</Badge> {data.name}</h2>
        </Col>
      </Row>
      <Row>
        <Col>{fieldInfo(data)}</Col>
      </Row>
    </>
  );
}

export default FieldDetails;
