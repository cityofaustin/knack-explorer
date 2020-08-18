import React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Badge from "react-bootstrap/Badge";
import BootstrapTable from "react-bootstrap/Table";
import Table from "./Table";
import MetadataContext from "./MetadataContext";

function findInstances(obj, val, path = []) {
  // modified this: https://gist.github.com/YagoLopez/1c2fe87d255fc64d5f1bf6a920b67484
  // to include path
  var objects = [];
  // var lastkey = Array.isArray(obj)
  for (var i in obj) {
    // clone the path
    var newPath = path.slice();

    if (!obj.hasOwnProperty(i)) {
      continue;
    }
    if (typeof obj[i] === "object") {
      const pathKey = obj[i] === null ? i : obj[i].key || i;
      newPath.push(pathKey);
      objects = objects.concat(findInstances(obj[i], val, newPath));
    } else if (obj[i] === val) {
      objects.push({ key: i, path: newPath });
    }
  }
  return objects;
}

function setPathLinks(path) {
  path = path.map((pathComponentString, i) => {
    if (pathComponentString.includes("scene_")) {
      return (
        <span key={i} >
          {" > "}
          <Link key={i} to={`/scenes/${pathComponentString}`}>{pathComponentString}</Link>
        </span>
      );
    } else if (pathComponentString.includes("object_")) {
      return (
        <span key={i} >
          {" > "}
          <Link key={i} to={`/objects/${pathComponentString}`}>{pathComponentString}</Link>
        </span>
      );
    } else if (pathComponentString.includes("field_")) {
      return (
        <span key={i} >
          {" > "}
          <Link key={i} to={`/fields/${pathComponentString}`}>{pathComponentString}</Link>
        </span>
      );
    } else if (pathComponentString.includes("view_")) {
      return (
        <span key={i} >
          {" > "}
          <Link key={i} to={`/views/${pathComponentString}`}>{pathComponentString}</Link>
        </span>
      );
    } else {
      return (
        <span key={i} >
          {" > "}
          {pathComponentString}
        </span>
      );
    }
  });
  return <span>{path.map((p) => p)}</span>;
}

function findField(fields, key) {
  return fields.filter((field) => field.key === key)[0];
}

function fieldInfo(data) {
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
              <td>Object</td>
              <td>
                <Link to={`/objects/${data.object_key}`}>
                  {data.object_key}
                </Link>
              </td>
            </tr>
            <tr>
              <td>Type</td>
              <td>{data.type}</td>
            </tr>
            <tr>
              <td>Required</td>
              <td>{data.required}</td>
            </tr>
            <tr>
              <td>Unique</td>
              <td>{data.unique}</td>
            </tr>
            <tr>
              <td>User</td>
              <td>{data.user}</td>
            </tr>
            <tr>
              <td>Conditional</td>
              <td>{data.conditional}</td>
            </tr>
            <tr>
              <td>Rules</td>
              <td>{data.rules}</td>
            </tr>
            <tr>
              <td>Validation</td>
              <td>{data.validation}</td>
            </tr>
          </tbody>
        </BootstrapTable>
      </Col>
    </Row>
  );
}

function FieldDetails(props) {
  const metadata = React.useContext(MetadataContext);

  const key = useRouteMatch("/fields/:key").params.key;
  if (!metadata) {
    return (
      <Row>
        <Col>
          <p>
            Metadata not loaded. Please go <Link to="/">home</Link>.
          </p>
        </Col>
      </Row>
    );
  }

  const data = findField(metadata.fields, key);

  let instances = findInstances(metadata, key);

  instances = instances.map((instance) => {
    instance.path = setPathLinks(instance.path);
    return instance;
  });

  let tableConfig = {
    title: "Appears In",
    fields: [
      {
        id: 1,
        name: "path",
        label: "Path",
        data_type: "jsx",
      },
      {
        id: 2,
        name: "key",
        label: "Key",
        data_type: "text",
      },
    ],
  };

  return (
    <>
      <Row>
        <Col>
          <h3>
            <Badge variant="info" className="text-monospace">
              Field
            </Badge>{" "}
            {data.name}
          </h3>
        </Col>
      </Row>
      <Row>
        <Col>{fieldInfo(data)}</Col>
      </Row>
      {instances && <Table rows={instances} {...tableConfig} />}
    </>
  );
}

export default FieldDetails;
