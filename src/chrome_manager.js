var list_sentences = [];
var tabDict = {}

// Class that works with Chrome APIs
class ChromeManager {

  // Instantiates the manager with the tabs currently open
  constructor() {
    this.tabDict = {}; // dictionary with tab ids
    this.tabTitles = []; // list of tab titles
  
    await this.queryTabs();
  }

  // Get the open tabs from the manager
  getTabs() {
    return (this.tabDict, this.tabTitles);
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

  // Function to create ch
  async createChromeGroups(groups) {
    var createData = {type: "normal", state: "maximized"};
    var winId;

    // Get the current window
    chrome.windows.getCurrent(function (win) {
      winId = win.id;
    });

    for(let i in groups) {
      console.log("Group:" + i);
      let tabIds= [];

      // Find all the tabs in the group
      for(let j in groups[i]){
        tabIds.push(this.tabDict[this.tabTitles[groups[i][j]]]);
        console.log(groups[i][j], this.tabTitles[groups[i][j]])
      }

      console.log("Creating groups..");

      // Group all the tabs in the group with chrome
      const groupId = await chrome.tabs.group({createProperties: {windowId: winId}, tabIds: tabIds});
    }

    await updateLogData();
    window.close();
  }
}
