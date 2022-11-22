// background service worker
const ChromeManager = require('./chrome_manager.js');

// Retrieve all the log data from Chrome
let chromeManager = new ChromeManager();
chromeManager.getLogData();