window.onload = function() {
  // load the WaniKani page iframe
  chrome.storage.local.get("toLink", function(obj) {
    if (obj.toLink) {
      document.getElementById('wanikaniFrame').src = obj.toLink;
    }
  });
}