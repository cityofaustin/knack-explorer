import React from "react";
import { useRouteMatch } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Badge from "react-bootstrap/Badge";
import BootstrapTable from "react-bootstrap/Table";
import MetadataContext from "./MetadataContext";
import Nav from "./Nav";
import { metadataTable } from "./utils";
import { getMetadata } from "./getMetadata";

function buildLinks(appId) {
  return [{
    route: `/${appId}/views/$key`,
      param: "key",
        fieldname: "key",
  }]
};

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
  const context = React.useContext(MetadataContext);
  const metadata = context.metadata;
  const setMetadata = context.setMetadata;
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const matches = useRouteMatch("/:app_id/scenes/:key");
  const key = matches.params.key;
  const appId = matches.params.app_id;
  let data, links;


  if (error) {
    return <Alert variant="danger">{error}</Alert>
  }
  
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
    data = findScene(metadata.scenes, key);
    links = buildLinks(metadata.id);
  }

  return (
    <>
      <Nav metadata={metadata} setMetadata={setMetadata} />
      <Container>
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
              links
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default SceneDetails;
