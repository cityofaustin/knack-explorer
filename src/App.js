import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import AppDetails from "./components/AppDetails";
import ObjectDetails from "./components/ObjectDetails";
import FieldDetails from "./components/FieldDetails";
import SceneDetails from "./components/SceneDetails";
import MetadataContext from "./components/MetadataContext";

// const knackpyDev = "5d79512148c4af00106d1507";
// const dataTracker = "5815f29f7f7252cc2ca91c4f"
//
// object details > fields > field details
// view details
// scene details
// fields

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

function getMetadata(e, appId, setMetadata, setLoading, setError) {
  e.preventDefault();
  setLoading(true);
  const url = `https://api.knack.com/v1/applications/${appId}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      let metadata = data.application;
      metadata.views = extractViews(metadata);
      metadata.fields = extractFields(metadata);
      setMetadata(metadata);
      setLoading(false);
    })
    .catch((error) => {
      setError(error);
    });
}

function AppSearch(props) {
  const [appId, setAppId] = React.useState(null);
  const metadata = props.metadata;
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  if (error) {
    return <Alert>{error}</Alert>;
  }

  if (metadata && metadata.id) {
    return (
      <AppDetails
        metadata={metadata}
        tabKey={props.tabKey}
        setTabKey={props.setTabKey}
      />
    );
  }

  return (
    <Row>
      <Col md={6}>
        <Form>
          <Form.Row>
            <Col>
              <Form.Control
                type="knack_app_id"
                name="knack_app_id"
                placeholder="Enter an app ID"
                onChange={(e) => setAppId(e.target.value)}
              />
            </Col>
            <Col>
              <Button
                variant="primary"
                type="submit"
                onClick={(e) =>
                  getMetadata(e, appId, props.setMetadata, setLoading, setError)
                }
              >
                {loading && (
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
                )}
                {!loading && "Load app"}
              </Button>
            </Col>
          </Form.Row>
        </Form>
      </Col>
    </Row>
  );
}

function App() {
  const [metadata, setMetadata] = React.useState(null);
  // set the default tab to display after app load
  // this state persists after the user navigates away from the home page
  const [tabKey, setTabKey] = React.useState("info");

  return (
    <Router>
      <Switch>
        <Container>
          <Row>
            <Col>
              <h1>
                <Link to="/" className="text-reset">
                  Knack Explorer
                </Link>
              </h1>
            </Col>
          </Row>
          <Route exact path="/">
            <AppSearch
              metadata={metadata}
              setMetadata={setMetadata}
              tabKey={tabKey}
              setTabKey={setTabKey}
            />
          </Route>
          <Route path="/objects/:key">
            <MetadataContext.Provider value={metadata}>
              <ObjectDetails />
            </MetadataContext.Provider>
          </Route>
          <Route path="/fields/:key">
            <MetadataContext.Provider value={metadata}>
              <FieldDetails />
            </MetadataContext.Provider>
          </Route>
          <Route path="/scenes/:scene">
            <MetadataContext.Provider value={metadata}>
              <SceneDetails />
            </MetadataContext.Provider>
          </Route>
        </Container>
      </Switch>
    </Router>
  );
}

export default App;
