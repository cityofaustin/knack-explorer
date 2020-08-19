import React from "react";
import { useRouteMatch } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import BootstrapTable from "react-bootstrap/Table";
import MetadataContext from "./MetadataContext";
import Badge from "react-bootstrap/Badge";
import { metadataTable } from "./utils";

const LINKS = [
  {
    route: "/fields/$key",
    param: "key",
    fieldname: "key",
  },
  {
    route: "/objects/$object",
    param: "object",
    fieldname: "object",
  },
];

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
              <td>SOrt</td>
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
  const metadata = React.useContext(MetadataContext);

  const key = useRouteMatch("/objects/:key").params.key;
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

  let data = findObject(metadata.objects, key);

  data.relationships = handleConnections(data);

  return (
    <>
      <Row>
        <Col>
          <h3>
            <Badge variant="info" className="text-monospace">
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
                ["name", "object", "key", "direction", "has", "belongs_to"],
                data.relationships,
                LINKS,
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
              {metadataTable("Fields", ["name", "key", "type"], data.fields, [
                LINKS[0]
              ])}
            </Col>
          </Row>
        </>
      )}
    </>
  );
}

export default ObjectDetails;
