import React from "react";
import { useRouteMatch } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import BootstrapTable from "react-bootstrap/Table";
import MetadataContext from "./MetadataContext";

function findObject(objects, key) {
  return objects.filter((obj) => obj.key === key)[0];
}

function objInfo(data) {
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
          </tbody>
        </BootstrapTable>
      </Col>
    </Row>
  );
}

function ObjectDetails(props) {
  const metadata = React.useContext(MetadataContext);

  const key = useRouteMatch("/object/:key").params.key;
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

  const data = findObject(metadata.objects, key);

  return (
    <>
      <Row>
        <Col>
          <h1>Hi</h1>
        </Col>
      </Row>
      <Row>
        <Col>{objInfo(data)}</Col>
      </Row>
    </>
  );
}

export default ObjectDetails;
