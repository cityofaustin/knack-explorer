import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import AppDetails from "./components/AppDetails";

// const knackpyDev = "5d79512148c4af00106d1507";
// const dataTracker = "5815f29f7f7252cc2ca91c4f"

//
// object details > fields > field details
// view details
// scene details
// fields

function getMetadata(appId, setMetadata) {
  setMetadata("loading");
  const url = `https://api.knack.com/v1/applications/${appId}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => setMetadata(data))
    .catch((error) => {
      console.error("Error:", error);
    });
}

function handleSubmit(e, appId, setMetadata) {
  e.preventDefault();
  getMetadata(appId, setMetadata);
}

function AppSearch() {
  const [appId, setAppId] = React.useState(null);
  const [metadata, setMetadata] = React.useState(null);

  if (metadata === "loading") {
    return <p>Loading...</p>;
  }

  if (metadata && metadata.application) {
    return <AppDetails metadata={metadata.application} />;
  }

  return (
    <Row>
      <Col md={6}>
        <Form>
          <Form.Group controlId="appId">
            <Form.Label>Application ID</Form.Label>
            <Form.Control
              type="appId"
              placeholder="Enter an app ID"
              onChange={(e) => setAppId(e.target.value)}
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            onClick={(e) => handleSubmit(e, appId, setMetadata)}
          >
            Submit
          </Button>
        </Form>
      </Col>
    </Row>
  );
}

function App() {
  return (
    <Container>
      <Row>
        <Col>
          <h1>Knack Explorer</h1>
        </Col>
      </Row>
      <AppSearch />
    </Container>
  );
}

export default App;
