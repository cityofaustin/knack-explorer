import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

function filterObjects(val, objects) {
  return objects.filter((obj) => {
    return obj.name.includes(val) || obj.key.includes(val);
  });
}

function search(val, metadata) {
  return filterObjects(val, metadata.objects);
}

function Search(props) {
  const [searchTerm, setSearchTerm] = React.useState(null);
  let res = undefined;

  if (searchTerm) {
    res = search(searchTerm.toLowerCase(), props.metadata);
  }
  
  return (
    <>
    <Row>
      <Col md={3}>
        <Form>
          <Form.Group controlId="appId">
            <Form.Label>Search</Form.Label>
            <Form.Control
              type="search"
              placeholder="Type something"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Col>
      </Row>
      <Row>
        <Col>
          {res && 
            <p>{JSON.stringify(res)}</p>
          }
        </Col>
      </Row>
    </>
  );
}

export default Search;
