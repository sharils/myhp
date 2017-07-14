(() => {
  const value = decodeURIComponent(
    location.search.replace('?input=', '').replace(/\++/g, '%20')
  );

  if (/^https?:\/\//.test(value)) {
    location = value;
    return;
  }

  const input = document.getElementsByTagName('input')[0];
  input.value = value;

  const form = document.getElementsByTagName('form')[0];
  form.onclick = ({ target: { nodeName, value } }) => {
    if (nodeName === 'BUTTON' && input.value) {
      location = value.replace('%s', encodeURIComponent(input.value));
    }
  };

  document.title = `${value} - My Homepage`;

  navigator.serviceWorker.register('/sw.js');
})()
