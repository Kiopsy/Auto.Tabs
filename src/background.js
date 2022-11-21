// background service worker
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

getLogData();