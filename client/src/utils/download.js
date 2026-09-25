// Turns a blob response (e.g. from a CSV export endpoint) into an actual
// browser download, since axios can't just follow a Content-Disposition
// header the way a plain <a href> would with an authenticated request.
export const downloadBlob = (blobData, filename) => {
  const url = window.URL.createObjectURL(new Blob([blobData]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
