import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
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
import { FaAngleDoubleRight } from "react-icons/fa";
import { getMetadata } from "./components/getMetadata";

// const knackpyDev = "5d79512148c4af00106d1507";
// const dataTracker = "5815f29f7f7252cc2ca91c4f"

function AppSearch(props) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  if (error) {
    setLoading(false);
  }

  return (
    <>
      <Container fluid className="bg-info text-white vh-100">
        <Row>
          <Col className="text-right">
            <Link className="text-reset" to="/about">
              About
            </Link>
          </Col>
        </Row>
        <Container>
          <Jumbotron className="bg-info text-white vh-100">
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
                      onChange={(e) => props.setAppId(e.target.value)}
                    />
                  </Col>
                  <Col>
                    <Button
                      className="mb-2"
                      variant="warning"
                      type="submit"
                      onClick={(e) =>
                        getMetadata(
                          e,
                          props.appId,
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
                      {!loading && (
                        <>
                          Explore app <FaAngleDoubleRight />
                        </>
                      )}
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
  const [appId, setAppId] = React.useState(null);
  // set the default tab to display after app load
  // this state persists after the user navigates away from the home page

  return (
    <Router>
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
                    <a
                      className="text-warning"
                      href="https://data.mobility.austin.gov/about"
                    >
                      {" "}
                      City of Austin Transportation Department
                    </a>
                    . It's free to use and the{" "}
                    <a
                      className="text-warning"
                      href="https://github.com/cityofaustin/knack-explorer"
                    >
                      source code
                    </a>{" "}
                    is in the public domain.
                  </p>
                </Col>
              </Row>
            </Container>
          </Container>
        </Route>
        <Route exact path="/">
          {metadata && <Redirect push from="/" to={`/${metadata.id}`} />}
          <AppSearch
            metadata={metadata}
            setMetadata={setMetadata}
            setAppId={setAppId}
            appId={appId}
          />
        </Route>
        <MetadataContext.Provider
          value={{ metadata: metadata, setMetadata: setMetadata }}
        >
          <Route exact path={`/:app_id`}>
            <AppDetails metadata={metadata} setMetadata={setMetadata} />
          </Route>
          <Route path={`/:app_id/objects/:key`}>
            <ObjectDetails />
          </Route>
          <Route path={`/:app_id/fields/:key`}>
            <FieldDetails />
          </Route>
          <Route path={`/:app_id/scenes/:key`}>
            <SceneDetails />
          </Route>
          <Route path={`/:app_id/views/:key`}>
            <ViewDetails />
          </Route>
        </MetadataContext.Provider>
      </Switch>
    </Router>
  );
}

export default App;
