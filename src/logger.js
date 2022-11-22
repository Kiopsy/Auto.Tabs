// Working with log data and Chrome's storage API for user study purposes


// Storing data using Chrome's storage API for user study purposes
async function updateLogData(){

    // number of groupings user has made in total and per day
    let date = new Date();
    let dateString = date.toJSON().slice(0, 10);
  
    // get the accesses from chrome.storage
    await chrome.storage.sync.get(['log'], function(result) {
        // result is a list of structs
        let data = result.log;

        console.log(result);
        console.log(data);

        let logData = {
        date: dateString, 
        tabsOpen: list_sentences.length,
        time: date.getHours() + ":" + date.getMinutes(),
        };

        data.push(logData);
        chrome.storage.sync.set({'log': data}, function() {});
    });
}
  

async function getLogData(){

    // number of groupings user has made in total and per day
    let date = new Date();
    let dateString = date.toJSON().slice(0, 10);

    // get the accesses from chrome.storage
    await chrome.storage.sync.get(['log'], function(result) {
        // result is a list of structs
        let data = result.log;

        console.log(data);
    });
}

module.exports = {getLogData, updateLogData};