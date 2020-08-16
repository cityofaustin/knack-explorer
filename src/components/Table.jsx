import React from "react";
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

function handleValue(row, field) {
  // logic to stringify row value for table cell
  const val = row[field.name];
  return field.data_type === "json" ? JSON.stringify(val) : val;
}

export default function Table(props) {
  let rows = props.rows;
  let fields = props.fields;

  // todo: not tested with multiple links
  const links = props.links;

  if (links !== undefined) {
    links.map((link) => {
      const linkCol = { id: link.name, label: link.label, name: link.name };
      fields.push(linkCol);
      return null;
    });
    links.map((link) => {
      rows = rows.map((row) => linkHandler(row, link));
      return null;
    });
  }

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
                    return <td key={i}> {handleValue(row, field)}</td>;
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
