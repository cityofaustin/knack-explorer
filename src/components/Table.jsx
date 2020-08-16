import React from "react";
import { Link } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import BootstrapTable from "react-bootstrap/Table";

function generateHeaderRow(fields) {
  return (
    <tr>
      {fields.map((field) => {
        return <th key={field.id}>{field.label}</th>;
      })}
    </tr>
  );
}

function linkHandler(row, link) {
  for (let i = 0; i < link.use_params.length; i++) {
    const param = link.use_params[i];
    const val = row[param];
    const url = link.url.replace(`$${param}`, val);
    row[link.name] = <a href={url}>{link.label}</a>;
  }
  return row;
}

function createLink() {}

function handleValue(row, field, links) {
  // logic to stringify row value for table cell
  let val = row[field.name];

  if (!links || field.data_type === "json") {
    // cannot use a json field as a link!
    return field.data_type === "json" ? JSON.stringify(val) : val;
  }

  let newVal = val;

  links.map((link) => {
    if (field.name === link.fieldname) {
      const route = link.route.replace(`$${link.param}`, row[link.param]);
      newVal = <Link to={route}>{val}</Link>;
    }
  });
  return newVal;
}

export default function Table(props) {
  let rows = props.rows;
  let fields = props.fields;

  // todo: not tested with multiple links
  const links = props.links;

  return (
    <Row className="mb-2">
      <Col>
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
