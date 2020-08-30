import React from "react";
import { useRouteMatch } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Badge from "react-bootstrap/Badge";
import BootstrapTable from "react-bootstrap/Table";
import MetadataContext from "./MetadataContext";
import Nav from "./Nav";
import { getMetadata } from "./getMetadata";

function findView(views, key) {
  return views.filter((view) => view.key === key)[0];
}

function viewInfo(data) {
  return (
    <Row>
      <Col>
        <BootstrapTable hover>
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
  const context = React.useContext(MetadataContext);
  const metadata = context.metadata;
  const setMetadata = context.setMetadata;
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const matches = useRouteMatch("/:app_id/views/:key");
  const key = matches.params.key;
  const appId = matches.params.app_id;
  let data;

  if (!metadata && !loading && !error) {
    getMetadata(null, appId, setMetadata, setLoading, setError);
  }

  if (!metadata && !error) {
    return (
      <>
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />
        <span className="sr-only">Loading...</span>
      </>
    );
  }

  if (metadata) {
    data = findView(metadata.views, key);
  }

  return (
    <>
      <Nav metadata={metadata} setMetadata={setMetadata} />
      <Container>
        <Row>
          <Col>
            <h3>
              <Badge variant="warning" className="text-monospace">
                View
              </Badge>{" "}
              {data.name}
            </h3>
          </Col>
        </Row>
        <Row>
          <Col>{viewInfo(data)}</Col>
        </Row>
      </Container>
    </>
  );
}

export default ViewDetails;
