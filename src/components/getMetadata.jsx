export function extractFields(metadata) {
  let fields = [];
  metadata.objects.map((object) => {
    let currentfields = object.fields.map((field) => {
      // add scene key as a view property
      field.object = object.key;
      return field;
    });
    fields = [...fields, ...currentfields];
    return null;
  });
  return fields;
}

export function extractViews(metadata) {
  let views = [];
  metadata.scenes.map((scene) => {
    let currentViews = scene.views.map((view) => {
      // add scene key as a view property
      view.scene = scene.key;
      return view;
    });
    views = [...views, ...currentViews];
    return null;
  });
  return views;
}

export function getMetadata(e, appId, setMetadata, setLoading, setError) {
  if (e) {
    e.preventDefault();
  }
  if (!appId) {
    setError("Invalid application id.");
    return null;
  }
  setLoading(true);
  const url = `https://api.knack.com/v1/applications/${appId}`;
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      let metadata = data.application;
      metadata.views = extractViews(metadata);
      metadata.fields = extractFields(metadata);
      setMetadata(metadata);
      setLoading(false);
    })
    .catch((error) => {
      setError(error.toString());
      return null;
    });
}
