import React from "react";
import { useRouteMatch } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Badge from "react-bootstrap/Badge";
import BootstrapTable from "react-bootstrap/Table";
import MetadataContext from "./MetadataContext";

function findScene(scenes, key) {
  return scenes.filter((field) => field.key === key)[0];
}

function sceneInfo(data) {
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
              <td>Slug</td>
              <td>{data.slug}</td>
            </tr>
          </tbody>
        </BootstrapTable>
      </Col>
    </Row>
  );
}

function SceneDetails(props) {
  const metadata = React.useContext(MetadataContext);

  const key = useRouteMatch("/scenes/:key").params.key;
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

  const data = findScene(metadata.scenes, key);

  return (
    <>
      <Row>
        <Col>
          <h2>
            <Badge variant="info" className="text-monospace">
              Scene
            </Badge>{" "}
            {data.name}
          </h2>
        </Col>
      </Row>
      <Row>
        <Col>{sceneInfo(data)}</Col>
      </Row>
    </>
  );
}

export default SceneDetails;
