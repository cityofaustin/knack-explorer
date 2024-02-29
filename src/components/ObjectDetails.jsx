import React from "react";
import { useRouteMatch } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import BootstrapTable from "react-bootstrap/Table";
import MetadataContext from "./MetadataContext";
import Badge from "react-bootstrap/Badge";
import Spinner from "react-bootstrap/Spinner";
import { metadataTable } from "./utils";
import { getMetadata } from "./getMetadata";
import Nav from "./Nav";

function buildLinks(appId) {
  return [
    {
      route: `/${appId}/fields/$key`,
      param: "key",
      fieldname: "key",
    },
    {
      route: `/${appId}/objects/$object`,
      param: "object",
      fieldname: "object",
    },
  ];
}

function handleConnections(data) {
  let inbound = data.connections.inbound.map((conn) => {
    conn.direction = "inbound";
    return conn;
  });

  let outbound = data.connections.outbound.map((conn) => {
    conn.direction = "outbound";
    return conn;
  });

  return [...inbound, ...outbound];
}

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
              <td>Key</td>
              <td>{data.key}</td>
            </tr>
            <tr>
              <td>Inflections</td>
              <td>{JSON.stringify(data.inflections)}</td>
            </tr>
            <tr>
              <td>Sort</td>
              <td>{JSON.stringify(data.sort)}</td>
            </tr>
            <tr>
              <td>Tasks</td>
              <td>{JSON.stringify(data.tasks)}</td>
            </tr>
          </tbody>
        </BootstrapTable>
      </Col>
    </Row>
  );
}

function ObjectDetails(props) {
  const context = React.useContext(MetadataContext);
  const metadata = context.metadata;
  const setMetadata = context.setMetadata;
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const matches = useRouteMatch("/:app_id/objects/:key");
  const key = matches.params.key;
  const appId = matches.params.app_id;
  let data, links;

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!metadata && !loading) {
    getMetadata(null, appId, setMetadata, setLoading, setError);
  }

  if (metadata) {
    data = findObject(metadata.objects, key);
    data.relationships = handleConnections(data);
    links = buildLinks(metadata.id);
  }

  return (
    <>
      {loading && (
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
      )}

      {metadata && (
        <>
          <Nav metadata={metadata} setMetadata={setMetadata} />
          <Container>
            <Row>
              <Col>
                <h3>
                  <Badge variant="warning" className="text-monospace">
                    Object
                  </Badge>{" "}
                  {data.name}
                </h3>
              </Col>
            </Row>
            <Row>
              <Col>{objInfo(data)}</Col>
            </Row>
            {data.relationships && data.relationships.length > 0 && (
              <>
                <Row>
                  <Col>
                    <h4>Connections</h4>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    {metadataTable(
                      "Connections",
                      [
                        "name",
                        "object",
                        "key",
                        "direction",
                        "has",
                        "belongs_to",
                      ],
                      data.relationships,
                      links
                    )}
                  </Col>
                </Row>
              </>
            )}
            {data.fields && data.fields.length > 0 && (
              <>
                <Row>
                  <Col>
                    <h4>Fields</h4>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    {metadataTable(
                      "Fields",
                      ["name", "key", "type"],
                      data.fields,
                      [links[0]]
                    )}
                  </Col>
                </Row>
              </>
            )}
          </Container>
        </>
      )}
    </>
  );
}

export default ObjectDetails;
