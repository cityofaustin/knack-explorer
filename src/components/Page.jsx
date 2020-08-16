import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Page(props) {
  const icon = props.icon ? props.icon : "";

  return (
      <Col>
        <Row>
          <Col>
            <h1>
              {icon} {props.title}
            </h1>
          </Col>
        </Row>
        {props.children}
      </Col>
  );
}

export default Page;
