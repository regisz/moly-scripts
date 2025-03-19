// ==UserScript==
// @name         Moly.hu Extend Year Selection in Yearly Plan
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Expands the year selection dropdown when adding books to the yearly plan on Moly.hu
// @author       ChatGPT
// @match        https://moly.hu/konyvek/*
// @grant        none
// @updateURL    https://github.com/regisz/moly-scripts/raw/main/extend_year_selection_in_yearly_plan.js
// @downloadURL  https://github.com/regisz/moly-scripts/raw/main/extend_year_selection_in_yearly_plan.js
// @homepageURL  https://github.com/regisz/moly-scripts/blob/main/extend_year_selection_in_yearly_plan.js
// ==/UserScript==

(function() {
    'use strict';

    function expandYearSelection() {
        const yearSelect = document.querySelector('#plan_year');

        if (!yearSelect) {
            console.log("Year selection dropdown not found.");
            return;
        }

        const currentYear = new Date().getFullYear();
        const maxYear = 2035; // Limit expansion to prevent unnecessary entries

        const existingYears = Array.from(yearSelect.options).map(option => parseInt(option.value)).filter(y => !isNaN(y));
        let lastYear = Math.max(...existingYears);

        if (lastYear < currentYear) {
            lastYear = currentYear;
        }

        for (let year = lastYear + 1; year <= maxYear; year++) {
            if (!existingYears.includes(year)) {
                const newOption = document.createElement('option');
                newOption.value = year;
                newOption.textContent = year;
                yearSelect.appendChild(newOption);
                console.log(`Added year: ${year}`);
            }
        }
    }

    function observeDOMChanges() {
        const observer = new MutationObserver(() => {
            expandYearSelection();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function init() {
        console.log('Running script to expand year selection...');
        expandYearSelection();
        observeDOMChanges();
    }

    init();

})();
