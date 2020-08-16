import React from "react";
import { useRouteMatch } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import BootstrapTable from "react-bootstrap/Table";
import MetadataContext from "./MetadataContext";
import { metadataTable } from "./utils";

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
              <td>Key</td>
              <td>{data.key}</td>
            </tr>
          </tbody>
        </BootstrapTable>
      </Col>
    </Row>
  );
}

function ObjectDetails(props) {
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
          <h1>{data.name}</h1>
        </Col>
      </Row>
      <Row>
        <Col>{fieldInfo(data)}</Col>
      </Row>
    </>
  );
}

export default ObjectDetails;
