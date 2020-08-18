import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

function filterObjects(val, objects) {
  return objects.filter((obj) => {
    return obj.name.includes(val) || obj.key.includes(val);
  });
}

function filterFields(val, fields) {
  const foundFields = fields.filter((field) => {
    return field.name.includes(val) || field.key.includes(val);
  });

  const rules = fields.filter(
    (field) => {
      if (field.rules !== null && field.rules.length > 0) {
        // fuck this?
        const rulesString = JSON.stringify(rules);
        return 
      }
    }
  );
  debugger;
  // const foundRules = fields.filter((field) => {
  //   return (field.name.includes(val) || field.key.includes(val))
  // });
  // field > rules 
}

function search(val, metadata) {
  const objects = filterObjects(val, metadata.objects);
  const fields = filterFields(val, metadata.fields);
  return [objects, fields];
}

function Search(props) {
  const [submitted, setSubmtited] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState(null);
  let res = undefined;

  if (searchTerm && submitted) {
    res = search(searchTerm.toLowerCase(), props.metadata);
  }

  return (
    <>
      <Row>
        <Col md={6}>
          <Form>
            <Form.Group controlId="appId">
              <Form.Label>Search</Form.Label>
              <Form.Control
                type="search"
                placeholder="Type something"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              onClick={() => {
                setLoading(true);
                setSubmtited(true);
              }}
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
              {!loading && "Search"}
            </Button>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col>{res && <p>{JSON.stringify(res)}</p>}</Col>
      </Row>
    </>
  );
}

export default Search;
