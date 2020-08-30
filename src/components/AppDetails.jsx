import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import BootstrapTable from "react-bootstrap/Table";
import { metadataTable } from "./utils";
import { FaInfoCircle, FaDatabase, FaEdit } from "react-icons/fa";
import { BsTextarea, BsLayoutTextWindowReverse } from "react-icons/bs";
import Nav from "./Nav";
import MetadataContext from "./MetadataContext";
import { useRouteMatch } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import { getMetadata } from "./getMetadata";

function buildLinks(appId) {
  return {
    objects: [
      {
        route: `${appId}/objects/$key`,
        param: "key",
        fieldname: "key",
      },
    ],
    scenes: [
      {
        route: `${appId}/scenes/$key`,
        param: "key",
        fieldname: "key",
      },
    ],
    views: [
      {
        route: `${appId}/views/$key`,
        param: "key",
        fieldname: "key",
      },
      {
        route: `${appId}/scenes/$scene`,
        param: "scene",
        fieldname: "scene",
      },
    ],
    fields: [
      {
        route: `${appId}/fields/$key`,
        param: "key",
        fieldname: "key",
      },
      {
        route: `${appId}/objects/$object`,
        param: "object",
        fieldname: "object",
      },
    ],
  };
}

function AppInfo(props) {
  const metadata = props.metadata;

  return (
    <Row>
      <Col>
        <BootstrapTable hover>
          <tbody>
            <tr>
              <td>Name</td>
              <td>{metadata.name}</td>
            </tr>
            <tr>
              <td>Description</td>
              <td>{metadata.description}</td>
            </tr>
            <tr>
              <td>Slug</td>
              <td>{metadata.slug}</td>
            </tr>
            <tr>
              <td>ID</td>
              <td>{metadata.id}</td>
            </tr>
            <tr>
              <td>Home Scene</td>
              <td>{JSON.stringify(metadata.home_scene)}</td>
            </tr>
          </tbody>
        </BootstrapTable>
      </Col>
    </Row>
  );
}

function AppDetails(props) {
  const [tabKey, setTabKey] = React.useState("info");
  const context = React.useContext(MetadataContext);
  const metadata = context.metadata;
  const setMetadata = context.setMetadata;
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  const appId = useRouteMatch("/:app_id").params.app_id;

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

  const links = buildLinks(metadata.id);

  return (
    <>
      <Nav metadata={metadata} setMetadata={props.setMetadata} />
      <Container>
        <Row>
          <Col>
            <Tabs
              id="controlled-tabs"
              activeKey={tabKey}
              onSelect={(k) => setTabKey(k)}
            >
              <Tab
                eventKey="info"
                title={
                  <>
                    <FaInfoCircle /> Info
                  </>
                }
              >
                <AppInfo metadata={metadata} />
              </Tab>
              <Tab
                eventKey="objects"
                title={
                  <>
                    <FaDatabase /> Objects
                  </>
                }
              >
                {metadataTable(
                  "Objects",
                  ["name", "key"],
                  metadata.objects,
                  links.objects,
                  true // search
                )}
              </Tab>
              <Tab
                eventKey="scenes"
                title={
                  <>
                    <BsLayoutTextWindowReverse /> Scenes
                  </>
                }
              >
                {metadataTable(
                  "Scenes",
                  ["name", "key", "slug", "parent"],
                  metadata.scenes,
                  links.scenes,
                  true // search
                )}
              </Tab>
              <Tab
                eventKey="views"
                title={
                  <>
                    <FaEdit /> Views
                  </>
                }
              >
                {metadataTable(
                  "Views",
                  ["name", "key", "type", "title", "scene"],
                  metadata.views,
                  links.views,
                  true // search
                )}
              </Tab>

              <Tab
                eventKey="fields"
                title={
                  <>
                    <BsTextarea /> Fields
                  </>
                }
              >
                {metadataTable(
                  "Fields",
                  ["name", "key", "type", "required", "object"],
                  metadata.fields,
                  links.fields,
                  true // search
                )}
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default AppDetails;
