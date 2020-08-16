import React from "react";
import { useRouteMatch } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import BootstrapTable from "react-bootstrap/Table";
import MetadataContext from "./MetadataContext";
import Badge from "react-bootstrap/Badge";
import { metadataTable } from "./utils";

const LINKS = {
  fields: [
    {
      route: "/fields/$key",
      param: "key",
      fieldname: "key",
    },
  ],
};

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
            <tr>
              <td>Connections</td>
              <td>{JSON.stringify(data.connections)}</td>
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

  const data = findObject(metadata.objects, key);

  return (
    <>
      <Row>
        <Col>
        <h2><Badge variant="info" className="text-monospace">Object</Badge> {data.name}</h2>
        </Col>
      </Row>
      <Row>
        <Col>{objInfo(data)}</Col>
      </Row>
      <Row>
        <Col>
          <Row>
            <Col>
              {metadataTable(
                "Fields",
                ["name", "key", "object"],
                data.fields,
                LINKS.fields
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}

export default ObjectDetails;
