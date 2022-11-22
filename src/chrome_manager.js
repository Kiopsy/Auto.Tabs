var list_sentences = [];
var tabDict = {}

// Class that works with Chrome APIs
class ChromeManager {

  // Instantiates the manager with the tabs currently open
  constructor() {
    this.tabDict = {}; // dictionary with tab ids
    this.tabTitles = []; // list of tab titles
  }

  getTabs() {
    return this.tabTitles;
  }

  // Queries Chrome for opened tabs
  async queryTabs() {
    let queryOptions = { currentWindow: true };
    let tabs = await chrome.tabs.query(queryOptions);

    // close duplicate tabs here

    tabs.forEach(tab => {
      this.tabTitles.push(tab.title);
      this.tabDict[tab.title] = tab.id;
    });
  }

  // Function to create Chrome tab groups based on groups from SentenceModel
  async createChromeGroups(groups) {
    var createData = {type: "normal", state: "maximized"};
    var winId;

    chrome.windows.getCurrent(function (win) {
      winId = win.id;
    });

    for(let i in groups) {
      console.log("Group:" + i);
      let tabIds= [];

      // Find all the tab ids within a group
      for(let j in groups[i]){
        tabIds.push(this.tabDict[this.tabTitles[groups[i][j]]]);
        console.log(groups[i][j], this.tabTitles[groups[i][j]])
      }

      console.log("Creating groups..");

      const groupId = await chrome.tabs.group({createProperties: {windowId: winId}, tabIds: tabIds});
    }
  }

  // Updating log data using Chrome storage API for user study purposes
  async updateLogData(){

    let date = new Date();
    let dateString = date.toJSON().slice(0, 10);

    await chrome.storage.sync.get(['log'], function(result) {

        // result is a list of structs
        let data = result.log;

        console.log(result);
        console.log(data);

        // Sets log data based on date accessed, and number of tabs open
        let logData = {
          date: dateString, 
          tabsOpen: this.tabTitles.length,
          time: date.getHours() + ":" + date.getMinutes(),
        };

        data.push(logData);
        chrome.storage.sync.set({['log']: data}, function() {});
    });
  }

  // gets all log data stored in Chrome's sync storage
  async getLogData(){
    await chrome.storage.sync.get(['log'], function(result) {
        // result is a list of structs
        let data = result.log;
        console.log(data);
    });
  }
}

module.exports = ChromeManager;
