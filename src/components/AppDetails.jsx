import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import BootstrapTable from "react-bootstrap/Table";
import { metadataTable } from "./utils";

const LINKS = {
  objects: [
    {
      route: "/objects/$key",
      param: "key",
      fieldname: "key",
    },
  ],
  scenes: [
    {
      route: "/scenes/$key",
      param: "key",
      fieldname: "key",
    },
  ],
  views: [
    {
      route: "/views/$key",
      param: "key",
      fieldname: "key",
    },
    {
      route: "/scenes/$scene",
      param: "scene",
      fieldname: "scene",
    },
  ],
  fields: [
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
  ],
};

function AppInfo(props) {
  const meta = props.meta;

  return (
    <Row>
      <Col>
        <BootstrapTable hover>
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
          <Tab eventKey="objects" title="Objects">
            {metadataTable(
              "Objects",
              ["name", "key"],
              metadata.objects,
              LINKS.objects
            )}
          </Tab>
          <Tab eventKey="scenes" title="Scenes">
            {metadataTable(
              "Scenes",
              ["name", "key", "slug", "parent"],
              metadata.scenes,
              LINKS.scenes
            )}
          </Tab>
          <Tab eventKey="views" title="Views">
            {metadataTable(
              "Views",
              ["name", "key", "type", "title", "scene"],
              metadata.views,
              LINKS.views
            )}
          </Tab>
          <Tab eventKey="fields" title="Fields">
            {metadataTable(
              "Fields",
              ["name", "key", "type", "required", "object"],
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
