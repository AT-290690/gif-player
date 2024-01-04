/**
 * Retrieves a item from the array.
 * @param {array} pool of random values.
 * @return {any} the random item;
 * @example
 *  randomiseFromPool(['#ff0000',#00ff00','#0000ff']);
 */
const randomiseFromPool = (pool) =>
  pool[Math.floor(Math.random() * pool.length)]

const gifInterface = document.getElementById('gifs_interface')
/**
 * Turns the gif into controlled canvas.
 * @param {object} image to tunr into preview canvas.
 * @return {object} RubbableGif object.
 * @example
 * gifPreview(image);
 */
const gifPreview = (image) => {
  const superGif = new RubbableGif({
    gif: image,
    progressbar_background_color: '#D6000D',
    progressbar_foreground_color: '#2be350',
  })
  superGif.load()
  return superGif
}

/**
 * Dynamically creates the control buttons for each gif.
 * @param {object} parent element of the parent
 * @return {function} returns a function that accepts callbacks for
 * each controll button in order like, info, preview.
 * @example
 *  createControls(gifContainer)(favoriteGif,GifInfo,controlGif);
 */

const createControls = (parent, recordCallback) => {
  const image = parent.firstChild
  const controlsContainer = document.createElement('div')
  controlsContainer.classList.add('controls_container')
  controlsContainer.style.background = parent.style.background
  parent.appendChild(controlsContainer)
  const superGif = recordCallback(image)
  const play = document.createElement('button')
  play.classList.add('control-button')
  play.innerHTML =
    '<img src="https://img.icons8.com/metro/26/000000/play.png"/>'
  controlsContainer.appendChild(play)
  play.addEventListener('click', superGif.play)

  const pause = document.createElement('button')
  pause.classList.add('control-button')
  pause.innerHTML =
    '<img src="https://img.icons8.com/metro/26/000000/pause.png"/>'
  controlsContainer.appendChild(pause)

  pause.addEventListener('click', superGif.pause)

  const clickAndHold = (btnEl) => {
    let timerId
    const DURATION = 100

    //handle when clicking down
    const onMouseDown = () => {
      timerId = setInterval(() => {
        btnEl && btnEl.click()
      }, DURATION)
    }

    //stop or clear interval
    const clearTimer = () => {
      timerId && clearInterval(timerId)
    }

    //handle when mouse is clicked
    btnEl.addEventListener('mousedown', onMouseDown)
    //handle when mouse is raised
    btnEl.addEventListener('mouseup', clearTimer)
    //handle mouse leaving the clicked button
    btnEl.addEventListener('mouseout', clearTimer)

    // a callback function to remove listeners useful in libs like react
    // when component or element is unmounted
    return () => {
      btnEl.removeEventListener('mousedown', onMouseDown)
      btnEl.removeEventListener('mouseup', clearTimer)
      btnEl.removeEventListener('mouseout', clearTimer)
    }
  }

  const moveBackwards = document.createElement('button')
  moveBackwards.innerHTML =
    '<img src="https://img.icons8.com/metro/26/000000/forward.png" height="20px" />'
  controlsContainer.appendChild(moveBackwards)
  moveBackwards.classList.add('control-button')
  moveBackwards.classList.add('flip')
  clickAndHold(moveBackwards)
  moveBackwards.addEventListener('click', () => {
    const step = superGif.get_current_frame() - 1
    if (step === 0) return
    superGif.move_to(step)
  })

  const moveForward = document.createElement('button')
  moveForward.innerHTML =
    '<img src="https://img.icons8.com/metro/26/000000/forward.png" height="20px" />'
  controlsContainer.appendChild(moveForward)
  moveForward.classList.add('control-button')
  clickAndHold(moveForward)
  moveForward.addEventListener('click', () => {
    const step = superGif.get_current_frame() + 1
    if (step === superGif.get_length()) return
    superGif.move_to(step)
  })
  let cutStartTime = 0
  let cutEndTime = superGif.get_length()

  const cutStart = document.createElement('button')
  cutStart.innerHTML =
    '<img src="https://img.icons8.com/metro/26/000000/scissors.png" height="20px" />'
  cutStart.title = cutStartTime
  controlsContainer.appendChild(cutStart)
  cutStart.classList.add('control-button')
  cutStart.addEventListener('click', () => {
    cutStartTime = superGif.get_current_frame()
    cutStart.title = cutStartTime
  })
  const cutEnd = document.createElement('button')
  cutEnd.innerHTML =
    '<img src="https://img.icons8.com/metro/26/000000/scissors.png" height="20px" />'
  cutEnd.title = cutEndTime
  controlsContainer.appendChild(cutEnd)
  cutEnd.classList.add('control-button')
  cutEnd.classList.add('flip')

  cutEnd.addEventListener('click', () => {
    cutEndTime = superGif.get_current_frame()
    cutEnd.title = cutEndTime
  })
  const cut = document.createElement('button')
  cut.classList.add('control-button')
  cut.innerHTML =
    '<img src="https://img.icons8.com/metro/26/000000/movie.png" height="20px" />'
  controlsContainer.appendChild(cut)
  cut.addEventListener('click', () => {
    const gif = new GIF({
      workers: 2,
      quality: 10,
    })
    const frames = superGif.get_frames()
    if (cutStartTime < cutEndTime) {
      for (let i = cutStartTime; i < cutEndTime; ++i) {
        const current = frames[i]
        gif.addFrame(current.data, { delay: 10 * current.delay })
      }
    } else {
      for (let i = cutStartTime; i >= cutEndTime; --i) {
        const current = frames[i]
        gif.addFrame(current.data, { delay: 10 * current.delay })
      }
    }
    gif.on(
      'finished',
      (blob) => createGifInstance(URL.createObjectURL(blob)).parentNode
    )
    gif.render()
  })
  const remove = document.createElement('button')
  remove.classList.add('control-button')
  remove.innerHTML =
    '<img src="https://img.icons8.com/metro/26/000000/delete.png" height="20px" />'
  controlsContainer.appendChild(remove)
  remove.addEventListener('click', () => {
    parent.parentNode.removeChild(parent)
    gifPool.delete(id)
  })
}

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
  const gifContainer = document.createElement('div')
  if (container) gifInterface.appendChild(container)
  else gifInterface.appendChild(gifContainer)
  const image = document.createElement('img')
  image.src = src
  image.classList.add('gif-item')
  gifContainer.appendChild(image)
  return gifContainer
}

/**
 * Dynamically creates a gif instance - gif image and controllers.
 * @param {object} data of the giph from giphy api.
 * @param {number} index of the element inside the array. Default is 0.
 * @param {object} container to apend the gifs.
 * @return {object} gif div element.
 * @example
 * // creates the image element whit extra animation delay of 0.5 sec.
 * createGifInstance('http://api/fun.gif);
 */
export const createGifInstance = (data, container) => {
  const gifContainer = createGifImage(data, container)
  gifContainer.classList.add('gif-container')
  gifContainer.style.background = randomiseFromPool([
    '#d11141',
    '#00b159',
    '#00aedb',
    '#f37735',
    '#ffc425',
    '#e5e6eb',
    '#e9724c',
    '#ffc857',
    '#c5283d',
    '#7ac74f',
    '#56e39f',
    '#55dde0',
    '#f40076',
    '#eba6a9',
    '#bcaa99',
    '#9e3ae0',
    '#f72585',
    '#4cc9f0',
  ])
  const image = gifContainer.firstChild
  imagesLoaded(image, () =>
    // image.ready(gifContainer);
    createControls(gifContainer, gifPreview)
  )
  return gifContainer
}
