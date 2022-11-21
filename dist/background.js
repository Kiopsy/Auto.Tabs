!async function(){(new Date).toJSON().slice(0,10),await chrome.storage.sync.get(["log"],(function(o){let e=o.log;console.log(e)}))}();
//# sourceMappingURL=background.js.map
