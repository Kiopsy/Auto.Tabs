var list_sentences = [];
var tabDict = {}

// Class that works with Chrome APIs
class ChromeManager {

  // Instantiates the manager with the tabs currently open
  constructor() {
    this.tabDict = {}; // list of tab from chrome
    this.tabUrlDict = {};
    this.urls = [];
    this.allTabs = []; // list of all tab titles
    this.tabIds = [];

    this.g = this.ut = this.t = 0;
  }

  getAllTabs() {
    return this.allTabs;
  }

  getNonGroupTabs() {

  }

  async sortTabs() {
    this.urls.sort(function (a, b) {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    });

    for (let i = 0; i<this.urls.length; i++) {
      chrome.tabs.move(this.tabUrlDict[this.urls[i]], { index: 1000 + i });
      this.tabUrlDict[this.urls[i]] = i
    }
  }

  // Queries Chrome for opened tabs
  async queryTabs() {

    let queryOptions = { currentWindow: true, groupId: -1 };
    let tabs = await chrome.tabs.query(queryOptions);
    console.log(tabs);
    let tabsToRemove = []
    // close duplicate tabs here
    tabs.forEach(tab => {
      if(this.tabDict[tab.title]) {
        tabsToRemove.push(tab.id);
      } else {
        this.allTabs.push(tab.title);
        this.urls.push(tab.url);
        this.tabIds.push(tab.id);
        this.tabUrlDict[tab.url] = tab.id;
        this.tabDict[tab.title] = tab.id;
      }
    });

    //this.removeTabs(tabsToRemove);
    // this.sortTabs();
  }


  async removeTabs(tabIds) {
    tabIds.forEach(id => {
      chrome.tabs.remove(id);
    });
  }

  // Function to create Chrome tab groups based on groups from SentenceModel
  async createChromeGroups(groups) {
    var createData = { type: "normal", state: "maximized" };
    var winId;

    this.sortTabs();

    chrome.windows.getCurrent(function (win) {
      winId = win.id;
    });

    for (let i in groups) {
      console.log("Group:" + i);
      let tabIds = [];

      // Find all the tab ids within a group
      for (let j in groups[i]) {
        tabIds.push(this.tabDict[this.allTabs[groups[i][j]]]);
        console.log(groups[i][j], this.allTabs[groups[i][j]])
      }

      console.log("Creating groups..");

      const groupId = await chrome.tabs.group({ createProperties: { windowId: winId }, tabIds: tabIds });
    }
  }
  
  // Updating log data using Chrome storage API for user study purposes
  async updateLogData(groupLength) {

    // Getting number of groups, opened tabs, unopened tabs
    let queryOptions = { currentWindow: true };
    let t = await chrome.tabs.query(queryOptions);

    let g = new Set();
    t.forEach(tab => {
      if (tab.groupId != -1) {
        g.add(tab.groupId);
      }
    })

    let tabs = t.length;
    let groups = g.size - groupLength;

    let ungroupedTabs = this.allTabs.length;

    let date = new Date().toUTCString();
    // let dateString = date.toJSON().slice(0, 10);

    await chrome.storage.sync.get(['log'], function (result) {

      // result is a list of structs
      let data = result.log ? result.log : [];

      console.log(result);
      console.log(data);

      // Sets log data based on date accessed, and number of tabs open
      let logData = {
        date: date,
        groups: groups,
        tabsOpen: tabs,
        ungroupedTabs: ungroupedTabs,
      };

      data.push(logData);
      chrome.storage.sync.set({ 'log': data }, function () {
        console.log('saved');
      });
    });
  }

  // gets all log data stored in Chrome's sync storage
  async getLogData() {
    await chrome.storage.sync.get(['log'], function (result) {
      // result is a list of structs
      let data = result.log;
      console.log(data);
    });
  }
}

module.exports = ChromeManager;
