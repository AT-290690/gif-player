/**
 * Retrieves a item from the array.
 * @param {array} pool of random values.
 * @return {any} the random item;
 * @example
 *  randomiseFromPool(['#ff0000',#00ff00','#0000ff']);
 */
const randomiseFromPool = pool => {
  return pool[Math.floor(Math.random() * pool.length)];
};

const gifInterface = document.getElementById('gifs_interface');
/**
 * Turns the gif into controlled canvas.
 * @param {object} image to tunr into preview canvas.
 * @return {object} RubbableGif object.
 * @example
 * gifPreview(image);
 */
const gifPreview = image => {
  const superGif = new RubbableGif({
    gif: image,
    progressbar_background_color: '#D6000D',
    progressbar_foreground_color: '#2be350'
  });
  superGif.load();
  return superGif;
};

/**
 * Dynamically creates the control buttons for each gif.
 * @param {object} parent element of the parent
 * @return {function} returns a function that accepts callbacks for
 * each controll button in order like, info, preview.
 * @example
 *  createControls(gifContainer)(favoriteGif,GifInfo,controlGif);
 */
const createControls = (parent, recordCallback) => {
  const image = parent.firstChild;
  const controlsContainer = document.createElement('div');
  controlsContainer.classList.add('controls_container');
  controlsContainer.style.background = parent.style.background;
  parent.appendChild(controlsContainer);

  const superGif = recordCallback(image);
  const superGifCanvas = superGif.get_canvas();
  // superGifCanvas.css('box-sizing', 'unset');
  const play = document.createElement('button');
  play.classList.add('play-button');
  play.innerHTML =
    '<img src="https://img.icons8.com/metro/26/000000/play.png"/>';
  controlsContainer.appendChild(play);

  const pause = document.createElement('button');
  pause.classList.add('pause-button');
  pause.innerHTML =
    '<img src="https://img.icons8.com/metro/26/000000/pause.png"/>';
  controlsContainer.appendChild(pause);

  play.addEventListener('click', superGif.play);
  pause.addEventListener('click', superGif.pause);
};

/**
 * Dynamically creates an image element, adds src to and style to it
 * and appends it to the gifInterface container..
 * The image will have a class: ".gif-item".
 * The container will have a class: ".gif-container".
 * @param {string} src to the image.
 * @param {object} container of the element inside the array. Default is 0
 * @return {object} Returns the image element
 * @example
 * // returns the image element whit extra animation delay of 0.5 sec.
 * const image = createGifImage('http://api/fun.gif');
 */
const createGifImage = (src, container) => {
  const gifContainer = document.createElement('div');
  if (container) gifInterface.appendChild(container);
  else gifInterface.appendChild(gifContainer);
  const image = document.createElement('img');
  image.src = src;
  image.classList.add('gif-item');
  gifContainer.appendChild(image);
  return gifContainer;
};

/**
 * Dynamically creates a gif instance - gif image and controllers.
 * Uses JQuery.
 * @param {object} data of the giph from giphy api.
 * @param {number} index of the element inside the array. Default is 0.
 * @param {object} container to apend the gifs.
 * @return {object} gif div element.
 * @example
 * // creates the image element whit extra animation delay of 0.5 sec.
 * createGifInstance('http://api/fun.gif',1);
 */
export const createGifInstance = (data, index = 0, container) => {
  const gifContainer = createGifImage(data, container);
  gifContainer.classList.add('gif-container');
  gifContainer.style.background = randomiseFromPool([
    '#209cee',
    '#f7d51d',
    '#41cc4a',
    '#a564af',
    '#3E4CC1',
    '#EA5C0A',
    '#38E7D4'
  ]);
  const image = gifContainer.firstChild;
  imagesLoaded(image, () => {
    // image.ready(gifContainer);
    createControls(gifContainer, gifPreview);
  });
  return gifContainer;
};
