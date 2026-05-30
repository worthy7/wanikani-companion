window.onload = function () {
  getWkUserData(function(wkUserData) {
    if (!wkUserData) return;

    fullfillUserData(wkUserData);

    // display info message if the user is coming for the first time
    if (
      wkUserData.userPublicKey === undefined ||
      wkUserData.userPublicKey == ""
    ) {
      document.querySelector(".info").style.display = "inline";
    } else {
      // reload user data
      requestUserData(false, function () {
        getWkUserData(function(newWkUserData) {
          fullfillUserData(newWkUserData);
        });
      });
    }

    // display Gravatar image (if exist)
    if (wkUserData.gravatar) {
      const gravatarUrl = "https://www.gravatar.com/avatar/" + wkUserData.gravatar;
      fetch(gravatarUrl + "?d=404")
        .then(response => {
          if (response.ok) {
            document.getElementById("gravatar").src = gravatarUrl;
          }
        })
        .catch(err => console.error("Gravatar fetch error:", err));
    }

    // when the user click on a link, it redirect the url to the web-container page or a new Chrome tab (depends on user settings)
    var inApp = wkUserData.inAppNavigation;
    document.getElementById("toLessons").onclick = function () {
      var url = "https://www.wanikani.com/lesson/session";
      if (inApp) {
        chrome.storage.local.set({ toLink: url }, function() {
          window.location.href = "/html/web-container.html";
        });
      } else {
        chrome.tabs.create({ url: url });
      }
    };
    document.getElementById("toReviews").onclick = function () {
      var url = "https://www.wanikani.com/review/session";
      if (inApp) {
        chrome.storage.local.set({ toLink: url }, function() {
          window.location.href = "/html/web-container.html";
        });
      } else {
        chrome.tabs.create({ url: url });
      }
    };
    document.getElementById("toDashboard").onclick = function () {
      var url = "https://www.wanikani.com/login";
      if (inApp) {
        chrome.storage.local.set({ toLink: url }, function() {
          window.location.href = "/html/web-container.html";
        });
      } else {
        chrome.tabs.create({ url: url });
      }
    };
  });

  // fullfill user data
  function fullfillUserData(wkUserData) {
    document.getElementById("username").innerHTML = wkUserData.username;
    document.getElementById("level").innerHTML = wkUserData.level;
    document.getElementById("nbLessons").innerHTML = wkUserData.nbLessons;
    document.getElementById("nbReviews").innerHTML = wkUserData.nbReviews;
    document.getElementById("reviewTime").innerHTML = wkUserData.nextReview || "---";
    document.getElementById("srsNbApprentice").innerHTML =
      wkUserData.srsNbApprentice;
    document.getElementById("srsNbGuru").innerHTML = wkUserData.srsNbGuru;
    document.getElementById("srsNbMaster").innerHTML = wkUserData.srsNbMaster;
    document.getElementById("srsNbEnlighten").innerHTML =
      wkUserData.srsNbEnlighten;
    document.getElementById("srsNbBurned").innerHTML = wkUserData.srsNbBurned;

    if (wkUserData.nbReviews > 0 || !wkUserData.nextReview) {
      // the user has reviews, or does not have next reviews
      document.querySelector("#reviews").style.display = "block";
      document.querySelector("#nextReviews").style.display = "none";
    } else {
      // the user does not have available reviews, display when will be the next one
      document.querySelector("#reviews").style.display = "none";
      document.querySelector("#nextReviews").style.display = "block";
    }
  }
};
