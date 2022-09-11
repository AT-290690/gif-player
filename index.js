import { createGifInstance } from './utils.js';

/**
 * onload event that creates all of the initial events.
 */
(() => {
  // drop events for now
  const dropfile = file => {
    const reader = new FileReader();
    reader.onload = async e => {
      createGifInstance(e.target.result);
    };
    reader.readAsDataURL(file, 'UTF-8');
  };
  document.body.ondragover = e => {
    e.preventDefault();
  };
  document.body.ondrop = e => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file.name.split('.').pop() !== 'gif') {
      alert('Can only drop .gif files!');
    } else {
      dropfile(file);
    }
  };
})();
