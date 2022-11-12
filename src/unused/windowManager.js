// Window Manager
const w = window.screen.availWidth;
const h = window.screen.availHeight;
const chrome_width_limit = 500;
const gap = 20;

const colors = [];

/**
 * Create a new window with the given tabs, size, and left position.
 * @param tabs - an array of URLs to open in the window
 * @param size - the number of windows you want to create
 * @param left - The left position of the window. This value is ignored for panels.
 */
function createWindow(tabs, size, left) {
    chrome.windows.create({
    url: tabs,
    type: "normal",
    width: Math.round(size),
    height: h,
    left: Math.round(left),
    top: 0
    });
}

/**
 * Get the current window, then update it with the new size and position.
 * @param size - The number of windows you want to split the screen into.
 * @param left - The left position of the window.
 */
function updateWindow(size, left) {
    chrome.windows.getCurrent(function (window) {
    var updateInfo = {
        width: Math.round(size),
        height: h,
        left: Math.round(left),
        top: 0
    };
    (updateInfo.state = "normal"), chrome.windows.update(window.id, updateInfo);
    });
}

/* Splitting the screen into two parts. */
export default async function split(ratio, screenSide) {
    // query Chrome for tabs in current window
    let queryOptions = { currentWindow: true };
    let tabs = await chrome.tabs.query(queryOptions);

    let inactiveTabs = [];
    let activeTabs = [];

    let screenSideRatio, oppositeSideRatio;
    
    if (toPixels(ratio) < chrome_width_limit ) {
      screenSideRatio = fromPixels(chrome_width_limit + gap);
      oppositeSideRatio = fromPixels(w - 500 - gap);
    } else if (toPixels(10 - ratio) < chrome_width_limit) { 
      screenSideRatio = fromPixels(w - 500 - gap);
      oppositeSideRatio = fromPixels(chrome_width_limit + gap);
    } else {
      screenSideRatio = ratio;
      oppositeSideRatio = 10 - ratio;
    }

    let l_size = toPixels(screenSideRatio);
    let r_size = toPixels(oppositeSideRatio);

    // sort tabs by activeness
    tabs.forEach(tab => {
      if (tab.active) {
        activeTabs.push(tab.url);
      } else {
        inactiveTabs.push(tab.url);
      }
    });

    if (screenSide == "L") {
        createWindow(activeTabs, l_size, 0);
        updateWindow(r_size, l_size);
    } else {
        createWindow(activeTabs, l_size, r_size);
        updateWindow(r_size, 0);
    }
}

// get a ratio from the number of pixels on the screen
function fromPixels(pixels) {
  return 10 / (w / pixels);
}

// pass in a ratio, get back the number of pixesls it takes up on-screen
function toPixels(ratio) {
  return w / (10 / ratio);
}