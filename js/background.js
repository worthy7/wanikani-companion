importScripts('/js/lib/moment.min.js', '/js/lib/webtoolkit.md5.js', '/js/helper.js');

const ALARM_NAME = "wk-update-alarm";

// initialization
chrome.runtime.onInstalled.addListener(() => {
  // initialize the badge color
  chrome.action.setBadgeBackgroundColor({ color: "#ff00aa" });

  // check that there is a Chrome sync value
  chrome.storage.sync.get("wkUserData", function (obj) {
    if (!obj.wkUserData) {
      chrome.storage.local.get("wkUserData", function (localObj) {
        if (!localObj.wkUserData) {
          setWkUserData(new WkUserData(), startAlarm);
        } else {
          startAlarm();
        }
      });
    } else {
      // get the existing user data from Chrome sync
      chrome.storage.local.set({ wkUserData: obj.wkUserData }, startAlarm);
    }
  });
});

function startAlarm() {
  getWkUserData(function (wkUserData) {
    const periodInMinutes = (wkUserData && wkUserData.refreshInterval) ? Math.max(1, wkUserData.refreshInterval / 60000) : 15;
    chrome.alarms.create(ALARM_NAME, { periodInMinutes: periodInMinutes });
    requestUserData(true);
  });
}

// update data when alarm fires
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    requestUserData(true);
  }
});

// when the update interval is changed, restart alarm with the updated interval
chrome.storage.onChanged.addListener(function (changes, namespace) {
  if ("wkUserData" in changes) {
    var oldValues = changes.wkUserData.oldValue;
    var newValues = changes.wkUserData.newValue;
    if (newValues && (!oldValues || newValues.refreshInterval != oldValues.refreshInterval)) {
      const periodInMinutes = Math.max(1, newValues.refreshInterval / 60000);
      chrome.alarms.create(ALARM_NAME, { periodInMinutes: periodInMinutes });
    }
  }
});

