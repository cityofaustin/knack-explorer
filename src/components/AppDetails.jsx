import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import BootstrapTable from "react-bootstrap/Table";
import { metadataTable } from "./utils";
import { FaInfoCircle, FaDatabase, FaEdit } from "react-icons/fa";
import { BsTextarea, BsLayoutTextWindowReverse } from "react-icons/bs";

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
  const [tabKey, setTabKey] = [props.tabKey, props.setTabKey];
  const metadata = props.metadata;
  return (
    <>
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
                LINKS.objects,
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
                LINKS.scenes,
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
                LINKS.views,
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
                LINKS.fields,
                true // search
              )}
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </>
  );
}

export default AppDetails;
