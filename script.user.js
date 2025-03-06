// ==UserScript==
// @name         FFLogs => XIVAnalysis
// @namespace    http://tampermonkey.net/
// @version      2025-03-06
// @description  Inject a link to XIVAnalysis on FFLogs report pages
// @author       github.com/nomnivor
// @match        https://www.fflogs.com/reports/*
// @icon         https://xivanalysis.com/logo.png
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // Function to create the XIVAnalysis link
  function createXivAnalysisLink() {
    // Get the current URL
    const currentUrl = window.location.href;

    // Extract the report ID (part after /reports/)
    const pathMatch = currentUrl.match(/\/reports\/([a-zA-Z0-9]+)/);
    if (!pathMatch) return; // Exit if report ID is not found

    const reportId = pathMatch[1];

    // Optionally extract the "fight" query parameter (for now, we just store it)
    const urlParams = new URLSearchParams(window.location.search);
    let fightParam = urlParams.get("fight");

    // parse the 'last' fight to an id
    if (
      fightParam === "last" &&
      typeof fights !== "undefined" &&
      Array.isArray(fights)
    ) {
      fightParam = fights.findLast((f) => f.boss !== 0)?.id ?? null;
    }

    // Construct the new URL for XIVAnalysis
    let xivAnalysisUrl = `https://xivanalysis.com/fflogs/${reportId}`;

    if (fightParam && !isNaN(fightParam)) {
      xivAnalysisUrl += `/${fightParam}`;
    }

    // check if link already exists
    const existingLink = document.querySelector("#xivanalysis-link");
    if (existingLink) {
      // update link only
      existingLink.href = xivAnalysisUrl;
      return;
    }
    // Create the <a> element
    const linkElement = document.createElement("a");
    linkElement.href = xivAnalysisUrl;
    linkElement.target = "_blank";
    linkElement.id = "xivanalysis-link";
    linkElement.classList.add("big-tab", "view-type-tab");

    linkElement.innerHTML = `
            <img src="https://xivanalysis.com/logo.png" style="width: 22px; height: 19px;" />
            <span class="big-tab-text"><br>XIVAnalysis</span>
        `;

    // Find the container where you want to inject the link
    const targetContainer = document.querySelector("#top-level-view-tabs"); // Update this to the right container ID

    if (targetContainer) {
      targetContainer.appendChild(linkElement);
    } else {
      // If the container is not found, log the issue (or inject into body)
      document.body.appendChild(linkElement);
    }
  }

  // Run the function when the page is fully loaded
  window.addEventListener("load", createXivAnalysisLink);

  // listen for navigation changes to update the url
  window.addEventListener("popstate", createXivAnalysisLink);
})();
