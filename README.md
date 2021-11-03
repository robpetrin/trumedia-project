# Statistical Analysis Project

## MLB Batter Comparison
* Explore prototyping and front-end dev in sports analytics context
* Create an interactive tool to view MLB batter <s>or NFL QB</s> performance over time
* Use [API](https://project.trumedianetworks.com/docs/static/index.html#/) to get game-by-game data for 3 players
* Include derived stats (AVG and OPS)
    * AVG = H/AB
    * OPS = OBP + SLG
        * OBP = (H + BB + HBP) / (AB + BB + SF + HBP)
        * SLG = TB / AB
* And counting stats (PA, AB, H, HR, BB, K, RBI)
* I'm not going to explicitly show HBP, SF, or TB (not commonly shown on game logs or standard box scores)

## Caveats
* Functional in Desktop only, and Chrome/Firefox only
* It "works" in Chrome and Firefox on Android, but UI is not responsive
* Essentially it doesn't play nice in any Safari, or on iOS Chrome
* This appears to be because of the use of innerHTML
* I attempted to re-factor to use createElement and append but those didn't work either
* This is a cautionary tale of choosing vanilla JS over React or Vue (see below for why I did though)

## Methodology
* The goal was a compact but functional and intuitive UI
* Scaffolded in CodePen, built with Pug, Sass, and JS
* Exported to not get caught up in setting up build process
* Decided to go with a centered horizontal/vertical card
* Basis was ESPN.com Player Profiles and SportsCenter stat frames
* I always pictured it with a date range filter but was willing to ditch it
* Derived stats increment after each game in stats table, other stats are static but still increment
* Totals are dynamic (only for games rendered)
* I left the asynchronous API calls for last but it came together more quickly than expected
* Getting the date range to be comparison-friendly was a bit of work, though
* Dropping the leading 0 from AVG, OBP, etc. was interesting
* Built it (1) fully static, (2) dynamic-UI-with-static-data, then finally (3) fully dynamic
* Arrow keys also paginate the players
* React/Vue would be nice for hooks, but I would have analysis paralysis on decisions on whether or not this app is self-contained or part of a larger suite
* Ideally I'd cache the API call to not have to query for the same info
* But it's not as reasonable to cache if it's hundreds of players being accessed
* So I cached the player IDs but every call is a fresh call
* But I skip unnecessary calls when you already have a valid token or the player list

## Todo (Future UI Improvements)
* Fancier scrollbars
* Table heading should be sticky as you scroll
* Make it responsive
* Team Logo becomes Dynamic Gradient on `<body>`
* Buffer gradient at top/bottom of table to indicate scroll
* Table sorting, including for dates (ensure it is not alphabetical)
* Smoother transitions when changing players -- loading indicator?

## Todo (Future Data & Logic Improvements)
* Dynamic Opening Day/End of Season dates based on data set
* Re-write in React or Vue, modularize logic
* Data management could be more optimized (but is fine for only three players)
* Get Litepicker via NPM rather than an include

## Dependencies & Sources
* [Box Shadow (3)](https://getcssscan.com/css-box-shadow-examples)
* [Google Fonts (Merriweather Sans)](https://fonts.google.com/specimen/Merriweather+Sans)
* [Gradient (Global Warming)](https://www.eggradients.com/category/green-gradient)
* [Litepicker (Date Picker)](https://litepicker.com/)