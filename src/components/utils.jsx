import React from "react";
import Table from "./Table";

export function getDataType(val) {
  // determine the data type of the value, which will be
  // assigned to the field definitiation so that it can be rendered properly
  const type = typeof val;
  if (type === "object" && val !== null) {
    return "json"
  } else if (type === "boolean") {
    return "bool"
  }
  return "text";
}

export function getFieldDefs(obj, keys) {
  // generate field definitations from a metadata object
  // will generate defs for the specified keys only if an array of keys is provided
  keys = keys !== undefined ? keys : Object.keys(obj);

  let fields = keys.map((key, i) => {
    return {
      id: i,
      name: key,
      label: key,
      data_type: getDataType(obj[key]),
    };
  });
  return fields;
}

export function metadataTable(title, fields, data, links, search=false) {
  let config = {
    title: title,
    fields: getFieldDefs(data[0], fields),
    links: links,
    search: search
  };
  return <Table rows={data} {...config} />;
}
