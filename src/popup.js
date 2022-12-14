// Popup functionality
const ChromeManager = require('./chrome_manager.js');
const SentenceModel = require('./sentence_model.js');

// Shows loading screen
function setLoadingScreen() {
    let onOpen = document.getElementById("onOpen");
    let onLoading = document.getElementById("onLoading");
  
    onOpen.setAttribute("style", "display: none");
    onLoading.setAttribute("style", "display: block; width: 100%; height: 100%");
}

async function group() {

    setLoadingScreen();

    // Create a new Chrome manager and get the user's open tabs
    let chromeManager = new ChromeManager();
    await chromeManager.queryTabs();
    let tabTitles = chromeManager.getAllTabs();

    // Get the threshold value inputted
    let threshold = document.getElementById("threshold").value;
    
    if (isNaN(threshold) || threshold > 1 || threshold < 0) {
        threshold = .5;
    }

    console.log(threshold);

    // Create a Tensorflow sentence model, and run it with the tab titles
    let sentenceModel = new SentenceModel(tabTitles, threshold);
    sentenceModel.get_similarity(chromeManager);

    // Bug with async functions
    // let groups = sentenceModel.getGroups();
    // console.log(groups);

    // Create Chrome groupings based on model groups
    // await chromeManager.createChromeGroups(groups); 
    // await chromeManager.updateLogData();
    //window.close();
}

// Set the group button's onClick
document.getElementById("autoGroupBtn").addEventListener("click", group); 
