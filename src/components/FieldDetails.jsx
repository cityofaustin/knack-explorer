import React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Badge from "react-bootstrap/Badge";
import Alert from "react-bootstrap/Alert";
import BootstrapTable from "react-bootstrap/Table";
import Table from "./Table";
import MetadataContext from "./MetadataContext";
import Nav from "./Nav";
import { getMetadata } from "./getMetadata";

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

function arraySearch(search_key, return_key, match_val, arr) {
  // assumes the array contains one and only one value of the matching key/val
  return arr.filter(elem => elem[search_key] === match_val)[0][return_key]
}

function setPathLinks(path, appId, metadata) {
  path = path.map((pathComponentString, i) => {
    if (pathComponentString.includes("scene_")) {
      return (
        <span key={i}>
          {" > "}
          <Link key={i} to={`/${appId}/scenes/${pathComponentString}`}>
            {arraySearch("key", "name", pathComponentString, metadata.scenes)}
          </Link>
        </span>
      );
    } else if (pathComponentString.includes("object_")) {
      return (
        <span key={i}>
          {" > "}
          <Link key={i} to={`/${appId}/objects/${pathComponentString}`}>
          {arraySearch("key", "name", pathComponentString, metadata.objects)}
          </Link>
        </span>
      );
    } else if (pathComponentString.includes("field_")) {
      return (
        <span key={i}>
          {" > "}
          <Link key={i} to={`/${appId}/fields/${pathComponentString}`}>
          {arraySearch("key", "name", pathComponentString, metadata.fields)}
          </Link>
        </span>
      );
    } else if (pathComponentString.includes("view_")) {
      return (
        <span key={i}>
          {" > "}
          <Link key={i} to={`/${appId}/views/${pathComponentString}`}>
          {arraySearch("key", "name", pathComponentString, metadata.views)}
          </Link>
        </span>
      );
    } else {
      return (
        <span key={i}>
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

function fieldInfo(data, appId) {
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
                <Link to={`/${appId}/objects/${data.object_key}`}>
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
              <td>{JSON.stringify(data.user)}</td>
            </tr>
            <tr>
              <td>Conditional</td>
              <td>{JSON.stringify(data.conditional)}</td>
            </tr>
            <tr>
              <td>Rules</td>
              <td>{JSON.stringify(data.rules)}</td>
            </tr>
            <tr>
              <td>Validation</td>
              <td>{JSON.stringify(data.validation)}</td>
            </tr>
          </tbody>
        </BootstrapTable>
      </Col>
    </Row>
  );
}

function FieldDetails(props) {
  const context = React.useContext(MetadataContext);
  const metadata = context.metadata;
  const setMetadata = context.setMetadata;
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const matches = useRouteMatch("/:app_id/fields/:key");
  const key = matches.params.key;
  const appId = matches.params.app_id;
  let data, instances;

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
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
    data = findField(metadata.fields, key);
    instances = findInstances(metadata, key);
  }

  instances = instances.map((instance) => {
    instance.path = setPathLinks(instance.path, appId, metadata);
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
      <Nav metadata={metadata} setMetadata={setMetadata} />
      <Container>
        <Row>
          <Col>
            <h3>
              <Badge variant="warning" className="text-monospace">
                Field
              </Badge>{" "}
              {data.name}
            </h3>
          </Col>
        </Row>
        <Row>
          <Col>{fieldInfo(data, appId)}</Col>
        </Row>
        {instances && (
          <>
            <Row>
              <Col>
                <h4>Appears In</h4>
              </Col>
            </Row>
            <Table rows={instances} {...tableConfig} />
          </>
        )}
      </Container>
    </>
  );
}

export default FieldDetails;
