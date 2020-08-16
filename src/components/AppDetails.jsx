import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import BootstrapTable from "react-bootstrap/Table";
import Search from "./Search";
import { metadataTable } from "./utils";

const LINKS = {
  objects: [
    {
      route: "/objects/$key",
      param: "key",
      fieldname: "key",
    },
  ],
  fields: [
    {
      route: "/fields/$key",
      param: "key",
      fieldname: "key",
    },
  ],
};

function AppInfo(props) {
  const meta = props.meta;

  return (
    <Row>
      <Col>
        <BootstrapTable striped bordered hover>
          <tbody>
            <tr>
              <td>Name</td>
              <td>{meta.name}</td>
            </tr>
            <tr>
              <td>Description</td>
              <td>{meta.description}</td>
            </tr>
            <tr>
              <td>Slug</td>
              <td>{meta.slug}</td>
            </tr>
            <tr>
              <td>ID</td>
              <td>{meta.id}</td>
            </tr>
            <tr>
              <td>Home Scene</td>
              <td>{JSON.stringify(meta.home_scene)}</td>
            </tr>
          </tbody>
        </BootstrapTable>
      </Col>
    </Row>
  );
}

function AppDetails(props) {
  const [tabKey, setTabKey] = [props.tabKey, props.setTabKey];
  const metadata = props.metadata;
  return (
    <Row>
      <Col>
        <Tabs
          id="controlled-tab-example"
          activeKey={tabKey}
          onSelect={(k) => setTabKey(k)}
        >
          <Tab eventKey="info" title="Info">
            <AppInfo meta={metadata} />
          </Tab>
          <Tab eventKey="search" title="Search">
            <Search metadata={metadata} />
          </Tab>
          <Tab eventKey="objects" title="Objects">
            {metadataTable(
              "Objects",
              ["name", "key", "identifier"],
              metadata.objects,
              LINKS.objects
            )}
          </Tab>
          <Tab eventKey="scenes" title="Scenes">
            {metadataTable(
              "Scenes",
              ["name", "key", "slug", "parent"],
              metadata.scenes
            )}
          </Tab>
          <Tab eventKey="views" title="Views">
            {metadataTable(
              "Views",
              ["name", "key", "type", "title", "scene"],
              metadata.views
            )}
          </Tab>
          <Tab eventKey="fields" title="Fields">
            {metadataTable(
              "Fields",
              ["name", "key", "object"],
              metadata.fields,
              LINKS.fields
            )}
          </Tab>
        </Tabs>
      </Col>
    </Row>
  );
}

export default AppDetails;
