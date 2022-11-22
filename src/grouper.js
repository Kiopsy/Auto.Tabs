import * as use from '@tensorflow-models/universal-sentence-encoder';
import * as tf from '@tensorflow/tfjs';

var list_sentences = [];
var input_threshold = 0.50;
var analyzing_text = true;
var tabDict = {}





async function analyzeSentences(){

  setLoadingScreen();

  let queryOptions = { currentWindow: true };
  let tabs = await chrome.tabs.query(queryOptions);
  let tabTitles = [];

  // sort tabs by activeness
  tabs.forEach(tab => {
    tabTitles.push(tab.title);
    tabDict[tab.title] = tab.id;
  });

  list_sentences = tabTitles;

  console.log("Tabs: " + tabTitles);
  let groups = get_similarity(tabTitles);
}




  let return_groups = [];
  for(var i in groups){
    return_groups.push(Array.from(new Set(groups[i])));
  }

  console.log(return_groups);
  createChromeGroups(return_groups);
  return return_groups;
}




async function createChromeGroups(groups) {
  var createData = {type: "normal", state: "maximized"};
  var winId;
  chrome.windows.getCurrent(function (win) {
    winId = win.id;
  });

  for(let i in groups) {
    console.log("group:" + i);
    let tabIds= [];
    for(let j in groups[i]){
      tabIds.push(tabDict[list_sentences[ groups[i][j] ]]);

      console.log(groups[i][j], list_sentences[ groups[i][j] ])
    }
    console.log("creating groups")
    console.log(tabIds);
    const groupId = await chrome.tabs.group({createProperties: {windowId: winId}, tabIds: tabIds});
  }

  await updateLogData();
  window.close();
}


