import React from "react";
import { useRouteMatch } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Badge from "react-bootstrap/Badge";
import BootstrapTable from "react-bootstrap/Table";
import MetadataContext from "./MetadataContext";
import { metadataTable } from "./utils";

const LINKS = [
  {
    route: "/views/$key",
    param: "key",
    fieldname: "key",
  },
]

function findScene(scenes, key) {
  return scenes.filter((scene) => scene.key === key)[0];
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
          <h3>
            <Badge variant="warning" className="text-monospace">
              Scene
            </Badge>{" "}
            {data.name}
          </h3>
        </Col>
      </Row>
      <Row>
        <Col>{sceneInfo(data)}</Col>
      </Row>
      <Row>
        <Col>
          <h4>Views</h4>
        </Col>
      </Row>
      <Row>
        <Col>
          {metadataTable(
            "Views",
            ["name", "key", "type", "title"],
            data.views,
            LINKS
          )}
        </Col>
      </Row>
    </>
  );
}

export default SceneDetails;
