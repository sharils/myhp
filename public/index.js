(() => {
  const value = decodeURIComponent(
    location.search.replace('?input=', '').replace(/\++/g, '%20')
  );

  if (/^https?:\/\//.test(value)) {
    location = value;
    return;
  }

  const input = document.querySelector('input');
  input.value = value;

  const form = document.querySelector('form');
  form.onclick = ({ target: { nodeName, value } }) => {
    if (nodeName === 'BUTTON' && input.value) {
      location = value.replace('%s', encodeURIComponent(input.value));
    }
  };

  document.title = (value ? `${value} - ` : '') + 'My Homepage';

  navigator.serviceWorker.register('/sw.js');
})()
