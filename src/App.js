import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Jumbotron from "react-bootstrap/Jumbotron";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import AppDetails from "./components/AppDetails";
import ObjectDetails from "./components/ObjectDetails";
import SceneDetails from "./components/SceneDetails";
import ViewDetails from "./components/ViewDetails";
import FieldDetails from "./components/FieldDetails";
import MetadataContext from "./components/MetadataContext";

// const knackpyDev = "5d79512148c4af00106d1507";
// const dataTracker = "5815f29f7f7252cc2ca91c4f"

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
  if (!appId) {
    setError("Invalid application id.");
    return null;
  }
  setLoading(true);
  const url = `https://api.knack.com/v1/applications/${appId}`;
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      let metadata = data.application;
      metadata.views = extractViews(metadata);
      metadata.fields = extractFields(metadata);
      setMetadata(metadata);
      setLoading(false);
    })
    .catch((error) => {
      setError(error.toString());
      return null;
    });
}

function AppSearch(props) {
  const [appId, setAppId] = React.useState(null);
  const metadata = props.metadata;
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  if (metadata && metadata.id) {
    return (
      <Container>
        <AppDetails
          metadata={metadata}
          tabKey={props.tabKey}
          setTabKey={props.setTabKey}
        />
      </Container>
    );
  }

  if (error && loading) {
    setLoading(false);
  }

  return (
    <>
      <Container fluid className="bg-dark text-white vh-100">
        <Row>
          <Col className="text-right">
            <Link className="text-reset" to="/about">
              About
            </Link>
          </Col>
        </Row>
        <Container>
          <Jumbotron className="bg-dark text-white vh-100">
            <Col>
              <h1>Knack Explorer</h1>
              <p>Explore your Knack application's metadata.</p>
              <Form>
                <Form.Row>
                  <Col s={12} md={7} lg={6} className="mb-2">
                    <Form.Control
                      type="knack_app_id"
                      name="knack_app_id"
                      placeholder="Enter an app ID"
                      onChange={(e) => setAppId(e.target.value)}
                    />
                  </Col>
                  <Col>
                    <Button
                      className="mb-2"
                      variant="primary"
                      type="submit"
                      onClick={(e) =>
                        getMetadata(
                          e,
                          appId,
                          props.setMetadata,
                          setLoading,
                          setError
                        )
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
              {error && <Alert variant="danger">{error}</Alert>}
            </Col>
          </Jumbotron>
        </Container>
      </Container>
    </>
  );
}

function App() {
  const [metadata, setMetadata] = React.useState(null);
  // set the default tab to display after app load
  // this state persists after the user navigates away from the home page
  const [tabKey, setTabKey] = React.useState("info");

  return (
    <Router>
      {metadata && (
        <>
          <Container fluid key={1}>
            <Row className="bg-dark justify-content-between pt-2">
              <Col>
                <h4 className="text-white">
                  <Link to="/" className="text-reset">
                    Knack Explorer
                  </Link>
                </h4>
              </Col>
              <Col md={2} className="text-warning text-right">
                <Button
                  size="sm"
                  variant="outline-warning"
                  onClick={() => setMetadata(null)}
                >
                  <Link className="text-warning" to="/">
                    Start Over
                  </Link>
                </Button>
              </Col>
            </Row>
          </Container>
          <Container>
            <Row className="mt-2">
              <Col>
                <h3>
                  <Link to="/" className="text-reset">
                    {metadata.name}
                  </Link>
                </h3>
              </Col>
            </Row>
          </Container>
        </>
      )}
      <Switch>
        <Route exact path="/">
          <AppSearch
            metadata={metadata}
            setMetadata={setMetadata}
            tabKey={tabKey}
            setTabKey={setTabKey}
          />
        </Route>
        <Container>
          <MetadataContext.Provider value={metadata}>
            <Route path="/objects/:key">
              <ObjectDetails />
            </Route>
            <Route path="/fields/:key">
              <FieldDetails />
            </Route>
            <Route path="/scenes/:key">
              <SceneDetails />
            </Route>
            <Route path="/views/:key">
              <ViewDetails />
            </Route>
          </MetadataContext.Provider>
        </Container>
      </Switch>
      <Switch>
        <Route path="/about">
          <Container fluid className="bg-dark text-white vh-100">
          <Row>
          <Col className="text-right">
            <Link className="text-reset" to="/">
              Home
            </Link>
          </Col>
        </Row>
            <Container>
            <Row className="bg-dark text-white">
                <Col>
                  <h3>About Knack Explorer</h3>
                <p className="text-light font-weight-light">
                  This project is maintained by the
                  <a className="text-warning" href="https://data.mobility.austin.gov/about">
                    {" "}
                    City of Austin Transportation Department
                  </a>
                  . It's free to use and the{" "}
                  <a className="text-warning" href="https://github.com/cityofaustin/knack-explorer">
                    source code
                  </a>{" "}
                  is in the public domain.
                </p>
              </Col>
              </Row>
              </Container>
          </Container>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
