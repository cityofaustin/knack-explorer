import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import BootstrapTable from "react-bootstrap/Table";
import Table from "./Table";
import Search from "./Search";
import { cloneDeep } from "lodash";

function extractFields(metadata) {
  let fields = [];
  metadata.objects.map((object) => {
    let currentfields = object.fields.map((field) => {
      // add scene key as a view property
      field.object = object.key;
      return field;
    });
    fields = [...fields, ...currentfields];
    return null;
  });
  return fields;
}

function extractViews(metadata) {
  let views = [];
  metadata.scenes.map((scene) => {
    let currentViews = scene.views.map((view) => {
      // add scene key as a view property
      view.scene = scene.key;
      return view;
    });
    views = [...views, ...currentViews];
    return null;
  });
  return views;
}

function getDataType(val) {
  // determine the data type of the value, which will be
  // assigned to the field definitiation so that it can be rendered properly
  const dataType = typeof val === "object" && val !== null ? "json" : "text";
  return dataType;
}

function getFieldDefs(obj, keys) {
  // generate field definitations from a metadata object
  // will generate defs for the specified keys only if an array of keys is provided
  keys = keys !== undefined ? keys : Object.keys(obj);

  let fields = keys.map((key, i) => {
    return {
      id: i,
      name: key,
      label: key,
      data_type: getDataType(obj[key]),
    };
  });
  return fields;
}

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

function metadataTable(title, fields, data, links) {
  let config = {
    title: title,
    fields: getFieldDefs(data[0], fields),
    links: links
  };
  return <Table rows={data} {...config} />;
}

function AppDetails(props) {
  const [key, setKey] = React.useState("info");
  const [metadata, setMetadata] = React.useState(props.metadata);

  React.useEffect(() => {
    // on first load, extract views from metadata and assign to top-level key in metadata
    const meta = cloneDeep(metadata);
    meta.views = extractViews(metadata);
    meta.fields = extractFields(metadata);
    setMetadata(meta);
  }, []);

  if (metadata.views === undefined) {
    return null;
  }

  return (
      <Row>
        <Col>
          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(k)}
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
                [{
                  route: "/object/$key",
                  param: "key",
                  fieldname: "key"
                }]
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
                metadata.fields
              )}
            </Tab>
          </Tabs>
        </Col>
      </Row>
  );
}

export default AppDetails;
