import React from "react";
import { useRouteMatch } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Badge from "react-bootstrap/Badge";
import BootstrapTable from "react-bootstrap/Table";
import MetadataContext from "./MetadataContext";

function findView(views, key) {
  return views.filter((view) => view.key === key)[0];
}

function viewInfo(data) {
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

function ViewDetails(props) {
  const metadata = React.useContext(MetadataContext);
  const key = useRouteMatch("/views/:key").params.key;
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

  const data = findView(metadata.views, key);

  return (
    <>
      <Row>
        <Col>
          <h2>
            <Badge variant="info" className="text-monospace">
              View
            </Badge>{" "}
            {data.name}
          </h2>
        </Col>
      </Row>
      <Row>
        <Col>{viewInfo(data)}</Col>
      </Row>
    </>
  );
}

export default ViewDetails;
