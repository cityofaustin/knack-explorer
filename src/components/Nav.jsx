import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";


export default function Nav(props) {
  return (
    <>
      <Container fluid key={1}>
        <Row className="bg-info justify-content-between pt-2">
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
              onClick={() => props.setMetadata(null)}
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
                {props.metadata.name}
              </Link>
            </h3>
          </Col>
        </Row>
      </Container>
    </>
  );
}
