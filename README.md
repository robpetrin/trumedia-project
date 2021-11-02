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
* I'm not going to explicitly show HBP, SF, or TB (not commonly on game logs or box scores or whatever)

## Methodology
* Compact but functional and intuitive UI
* Scaffolded in CodePen, built in Pug, Sass, and JS
* Exported to expedite build process
* Started on UI before diving into the API
* Best presented as a card, centered hori/vert
* Gradient was not meant to be dynamic at first
* Basis for typography was ESPN.com and ESPN TV stat frames
* The card is laid out --
    * Top-left for pagination and player demographics
    * Top-right for a date filter (external library)
    * I **might ditch it as a roadmap todo if it gets annoying**
    * Stats table on the next roe, filterable
        * The AVG, OBP, SLG, and OPS increment up
        * The other stats are static
    * A totals mini-table at the bottom
        * Totals for only the filtered range of games
* Chaining the API calls was a little more work than it should've been
* Built a static, then dynamic-with-static-data, then a dynamic version to not overdo API calls
* Arrow keys also paginate
* React/Vue would be nice for hooks, but I would have analysis paralysis on decisions
* Ideally I'd cache the API call to not have to query for the same info
* But it's not reasonable to cache if it's hundreds of players

## Todo (Assignment)
* Dynamic API calls
* Better comments

## Todo (Roadmap)
* Get way fancier with the scrollbars
* Ideally the date range restrictions would be dynamic basic on the data sets, or I'd have access to the 2018 opening/ending dates to structure that logic
* make it responsive
* Modularize it as part of a re-factor
* This in React or Vue
* Dynamic Gradient Based on Two Most Dominant Colors in Team Logo
* I think I can do better on the top/bottom of the stats table -- some kind of gradient fade to indicate scroll-ability
* The data totaling could be a more optimized version of itself
* Some optimizations are based on whether this is a static tool, or a component of a more fully-featured application. But more catering to either use-case is generally needed
* If viewing an unfiltered data set, sorting on the table would be useful
* Smoother transitions when changing players -- loading indicator?

## Dependencies
* [Google Fonts](https://fonts.google.com/specimen/Merriweather+Sans)
* [Gradient (Global Warming)](https://www.eggradients.com/category/green-gradient)
* [Box Shadow (3)](https://getcssscan.com/css-box-shadow-examples)
* [Grids](https://grid.layoutit.com/)
* [Date Picker](https://litepicker.com/docs)
* [API Requests](https://reqbin.com/)