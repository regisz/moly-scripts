// ==UserScript==
// @name         Moly.hu Extend Year Selection in Yearly Plan
// @namespace    https://github.com/regisz/moly-scripts
// @version      1.4
// @description  Expands the year selection dropdown when adding books to the yearly plan on Moly.hu, even after dynamic navigation
// @author       regisz
// @match        https://moly.hu/konyvek/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/regisz/moly-scripts/main/extend_year_selection_in_yearly_plan.user.js
// @downloadURL  https://raw.githubusercontent.com/regisz/moly-scripts/main/extend_year_selection_in_yearly_plan.user.js
// @homepageURL  https://github.com/regisz/moly-scripts
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

    function observePageChanges() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && document.querySelector('#plan_year')) {
                    console.log("Detected page change, running script...");
                    expandYearSelection();
                    break;
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function init() {
        console.log('Running script to expand year selection...');
        expandYearSelection();
        observePageChanges();
    }

    init();

})();