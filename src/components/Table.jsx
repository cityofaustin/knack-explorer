import React from "react";
import { Link } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import BootstrapTable from "react-bootstrap/Table";
import { FaSearch } from "react-icons/fa";

function generateHeaderRow(fields) {
  return (
    <tr>
      {fields.map((field) => {
        return <th key={field.id}>{field.label}</th>;
      })}
    </tr>
  );
}

function handleValue(row, field, links) {
  // logic to stringify row value for table cell
  let val = row[field.name];

  if (!links || field.data_type === "json") {
    // cannot use a json field or bool as a link
    return field.data_type === "json" ? JSON.stringify(val) : val;
  } else if (field.data_type === "bool") {
    return val.toString();
  }

  let newVal = val;

  links.map((link) => {
    if (field.name === link.fieldname) {
      const route = link.route.replace(`$${link.param}`, row[link.param]);
      newVal = <Link to={route}>{val}</Link>;
      return null;
    }
    return null;
  });
  return newVal;
}

function filterRows(rows, val) {
  if (val === "") return rows;
  val = val.toLowerCase();
  return rows.filter(
    (row) =>
      row.key.toLowerCase().includes(val) ||
      row.name.toLowerCase().includes(val)
  );
}

export default function Table(props) {
  const [searchTerm, setSearchTerm] = React.useState("");

  let rows = filterRows(props.rows, searchTerm);
  // todo: not tested with multiple links
  const links = props.links;
  return (
    <Row className="mb-2">
      <Col>
        {props.search && (
          <Form className="my-2">
            <Form.Row>
              <Col>
                <InputGroup className="mb-2">
                  <InputGroup.Prepend>
                    <InputGroup.Text>
                      <FaSearch />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    type="search"
                    name="search"
                    placeholder="Filter by name or key"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col></Col>
            </Form.Row>
          </Form>
        )}
        <BootstrapTable striped size="sm">
          <thead className="thead-dark">
            {generateHeaderRow(props.fields)}
          </thead>
          <tbody>
            {rows.map((row, i) => {
              return (
                <tr key={i}>
                  {props.fields.map((field, i) => {
                    return <td key={i}> {handleValue(row, field, links)}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </BootstrapTable>
      </Col>
    </Row>
  );
}
