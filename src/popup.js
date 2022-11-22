// Popup frontend

// Shows loading screen
function setLoadingScreen() {
    let onOpen = document.getElementById("onOpen");
    let onLoading = document.getElementById("onLoading");
  
    onOpen.setAttribute("style", "display: none");
    onLoading.setAttribute("style", "display: block; width: 100%; height: 100%");
}

// Set the group button's onClick to analyze the sentences
document.getElementById("autoGroupBtn").addEventListener("click", analyzeSentences); 

module.exports = {setLoadingScreen};