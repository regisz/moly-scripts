// ==UserScript==
// @name         Moly.hu Extend Year Selection in Yearly Plan
// @namespace    https://github.com/regisz/moly-scripts
// @version      1.7
// @description  Expands the year selection dropdown when adding books to the yearly plan on Moly.hu, even after dynamic navigation
// @author       regisz
// @match        https://moly.hu/konyvek/*
// @match        https://moly.hu/*/eves-terv*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/regisz/moly-scripts/main/extend_year_selection_in_yearly_plan.user.js
// @downloadURL  https://raw.githubusercontent.com/regisz/moly-scripts/main/extend_year_selection_in_yearly_plan.user.js
// @homepageURL  https://github.com/regisz/moly-scripts
// ==/UserScript==

(function () {
    'use strict';

    let lastUrl = location.href;

    function expandYearSelection() {
        const yearSelect = document.querySelector('#plan_year');

        if (!yearSelect) {
            console.log("Year selection dropdown not found.");
            return;
        }

        const currentYear = new Date().getFullYear();
        const maxYear = 2035; // Safety limit

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
        const observer = new MutationObserver(() => {
            if (document.querySelector('#plan_year')) {
                console.log("Detected page change, running script...");
                expandYearSelection();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function detectUrlChange() {
        new MutationObserver(() => {
            if (location.href !== lastUrl) {
                console.log("URL change detected, re-running script...");
                lastUrl = location.href;
                setTimeout(expandYearSelection, 100);
            }
        }).observe(document.body, { childList: true, subtree: true });

        window.addEventListener('popstate', () => {
            console.log("popstate event detected, re-running script...");
            lastUrl = location.href;
            setTimeout(expandYearSelection, 100);
        });

        window.addEventListener('pushState', () => {
            console.log("pushState event detected, re-running script...");
            lastUrl = location.href;
            setTimeout(expandYearSelection, 100);
        });

        setInterval(() => {
            if (location.href !== lastUrl) {
                console.log("Interval detected URL change, re-running script...");
                lastUrl = location.href;
                setTimeout(expandYearSelection, 100);
            }
        }, 1000);
    }

    function init() {
        console.log('Running script to expand year selection...');
        expandYearSelection();
        observePageChanges();
        detectUrlChange();
    }

    init();

})();