'use strict';
document.addEventListener('DOMContentLoaded', () => {

  const w = window.screen.availWidth;
  const h = window.screen.availHeight;

  /**
   * It creates a new window with the url of the tab, and the width and height of the screen, and the
   * left and top of the screen
   * @param tabs - the array of tabs you want to open
   * @returns A promise
   */
  function left(tabs) {
    return new Promise((resolve) => {
      chrome.windows.create({
        url: tabs,
        type: "normal",
        width: w  / 2,
        height: h,
        left: 0,
        top: 0
      });
    });
  }

  /**
   * It gets the current window, then updates it to be half the width of the screen, the full height of
   * the screen, and positioned on the right side of the screen
   * @param tabs - The tabs that are currently open in the current window.
   * @returns A promise
   */
  function right(tabs) {
    return new Promise((resolve) => {
      chrome.windows.getCurrent(function (window) {
        var updateInfo = {
          width: w  / 2,
          height: h,
          left: w / 2,
          top: 0
        };
        (updateInfo.state = "normal"), chrome.windows.update(window.id, updateInfo);
      });
    });
  }

  async function process(arrayOfPromises) {
      let responses = await Promise.all(arrayOfPromises);
      for(let r of responses) {}
      return;
  }


  async function getTabs() {
    // query Chrome for tabs in current window
    let queryOptions = { currentWindow: true };
    let tabs = await chrome.tabs.query(queryOptions);

    let inactiveTabs = [];
    let activeTabs = [];

    // sort tabs by activeness
    tabs.forEach(tab => {
      if (tab.active) {
        activeTabs.push(tab.url);
      } else {
        inactiveTabs.push(tab.url);
      }
    });


    let arrayOfPromises = [
      left(activeTabs),
      right(inactiveTabs)
    ];  
  
    await process(arrayOfPromises);

    // console.log(tabs);
    return [activeTabs, inactiveTabs]
  }

  let tabs = getTabs();

  console.log(tabs);
  let activeTabs = tabs[0];
  let inactiveTabs = tabs[1];
  
  console.log(activeTabs);
});




