// Limited Global Variables
let activeIndex = Math.floor(Math.random() * 3) // Default to a random player
let openingDay = '03/29/2018' // Set earliest date that can be picked in range
let endRegSeason = '10/01/2018' // Set latest date that can be picked in range

// Pagination functions
function goPrev() {
    let newIndex
    if (activeIndex > 0) {
        newIndex = activeIndex - 1
    } else {
        newIndex = 2
    }
    activeIndex = newIndex
    drawPage()
}

function goNext() {
    let newIndex
    if (activeIndex < 2) {
        newIndex = activeIndex + 1
    } else {
        newIndex = 0
    }
    activeIndex = newIndex
    drawPage()
}

// Use left and right arrow keys to paginate players
document.onkeydown = checkKey
function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '37') {
        goPrev()
    } else if (e.keyCode == '39') {
        goNext()
    }

}

// Date Picker Element
const picker = new Litepicker({
    element: document.getElementById('date-picker'),
    singleMode: false,
    minDate: openingDay,
    maxDate: endRegSeason,
    startDate: openingDay,
    endDate: endRegSeason,
    numberOfMonths: 2,
    numberOfColumns: 2,
    format: 'MMM D'
})

// Draw the UI on each page load, date range selection, or player pagination
function drawPage() {
    let urlRoot = 'https://project.trumedianetworks.com/api/'
    let apiKey = 'd6ac7457-a1ca-4710-8cff-47991b9ffcc2' // API Key -- though ideally not public on GitHub
    let token = '' // Token from first API call
    let players = [] // Array of player IDs from the second API call
    let playerData = [] // Array of player data from one of the players in the third API call

    // Asynchronous API and UI functions
    async function populateData() {
        await getToken()
        await getPlayers()
        await getPlayerStats()
        await populatePage()
        await appendGameLogs(playerData)
    }

    // API Call 1: Get a Token (if you need one)
    async function getToken() {
        // Only get a token if you lack one, or if yours expired
        if (!token.token || (Date.parse(token.expires) - Date.parse(new Date()) < 0)) {
            await fetch(urlRoot + 'token', {
                    headers: {
                        apiKey: apiKey
                    }
                })
                .then(data => {
                    if (!data.ok) {
                        throw Error(data.status)
                    }
                    return data.json()
                }).then(update => {
                    token = update
                })
        }
    }

    // API Call 2: Get list of Players (only if you need it)
    async function getPlayers() {
        // Only poll for players if we have none
        if (players.length === 0) {
            await fetch(urlRoot + 'mlb/players', {
                    headers: {
                        tempToken: token.token
                    }
                })
                .then(data => {
                    if (!data.ok) {
                        throw Error(data.status)
                    }
                    return data.json()
                }).then(update => {
                    update.forEach(player => {
                        players.push(player)
                    })
                })
        }
    }

    // API Call 3: Get game data for selected (random on page load) player
    async function getPlayerStats() {
        await fetch(urlRoot + 'mlb/player/' + players[activeIndex].playerId, {
                headers: {
                    tempToken: token.token
                }
            })
            .then(data => {
                if (!data.ok) {
                    throw Error(data.status)
                }
                return data.json()
            }).then(update => {
                update.forEach(game => {
                    playerData.push(game)
                })
            })
    }

    // Update the page with details about that player
    async function populatePage() {
        // Update the UI with player demographics
        let playerName = document.querySelector('#player-name')
        let playerPhoto = document.querySelector('#player-photo')
        let playerTeam = document.querySelector('#player-team')
        let playerTeamName = document.querySelector('#player-team-name')
        playerName.textContent = players[activeIndex].fullName
        playerPhoto.src = players[activeIndex].playerImage
        playerTeam.src = players[activeIndex].teamImage
        playerTeamName.textContent = playerData[0].team
        document.title = `TruMedia - ${players[activeIndex].fullName}`
    }

    // Populate the game log table and totals table for that player
    async function appendGameLogs(gameSet) {
        // Empty data set
        let filteredGameLog = []

        // Target the game log table
        let playerStatTable = document.querySelector('#player-stat-table')

        // Set date range to be comparison-friendly
        let start = new Date(picker.getStartDate().dateInstance)
        let end = new Date(picker.getEndDate().dateInstance)
        // Add time to end date to ensure day-of games are captured
        end.setHours(23, 59, 59, 59)

        // Only render game between chosen date range
        gameSet.forEach(game => {
            let gameTime = new Date(game.gameDate)
            if (gameTime >= start && gameTime <= end) {
                filteredGameLog.push(game)
            }
        })

        // Empty the table
        playerStatTable.innerHTML = ''
        // Add its heading back
        playerStatTable.innerHTML += `<tr>
                                  <th>Date</th>
                                  <th>Opp</th>
                                  <th>PA</th>
                                  <th>AB</th>
                                  <th>H</th>
                                  <th>HR</th>
                                  <th>RBI</th>
                                  <th>BB</th>
                                  <th>K</th>
                                  <th>AVG</th>
                                  <th>OBP</th>
                                  <th>SLG</th>
                                  <th>OPS</th> 
                                </tr>`

        // Totals for Derived Stats and Totals Table
        let gamesPlayed = 0
        let plateAppearances = 0
        let atBats = 0
        let hits = 0
        let homeRuns = 0
        let runsBattedIn = 0
        let basesOnBalls = 0
        let strikeouts = 0
        let hitByPitch = 0
        let sacFlies = 0
        let totalBases = 0
        let battingAverage = 0
        let onBasePercentage = 0
        let sluggingPercentage = 0
        let onBasePlusSlugging = 0

        filteredGameLog.forEach(game => {
            // Running Stat Tally
            gamesPlayed++
            plateAppearances += game.PA
            atBats += game.AB
            hits += game.H
            homeRuns += game.HR
            runsBattedIn += game.RBI
            basesOnBalls += game.BB
            strikeouts += game.K
            hitByPitch += game.HBP
            sacFlies += game.SF
            totalBases += game.TB
            battingAverage = (hits / atBats).toFixed(3).toString()
            let prettyBattingAverage = prettifyPercentage(battingAverage)
            onBasePercentage = ((hits + basesOnBalls + hitByPitch) / (atBats + basesOnBalls + sacFlies + hitByPitch)).toFixed(3).toString()
            let prettyOnBasePercentage = prettifyPercentage(onBasePercentage)
            sluggingPercentage = (totalBases / atBats).toFixed(3).toString()
            let prettySluggingPercentage = prettifyPercentage(sluggingPercentage)
            onBasePlusSlugging = prettifyPercentage((Number(onBasePercentage) + Number(sluggingPercentage)).toFixed(3).toString())

            // Formatting percentages with/without leading digit
            function prettifyPercentage(stat) {
                return (stat[0] === "0") ? stat.substring(1) : stat
            }

            // Populate totals table
            let playerTotals = document.querySelector('#player-totals')
            // Empty table in case there's content in it
            playerTotals.innerHTML = ''
            playerTotals.innerHTML = `
                          <td>${gamesPlayed}</td>
                          <td>${plateAppearances}</td>
                          <td>${atBats}</td>
                          <td>${hits}</td>
                          <td>${homeRuns}</td>
                          <td>${runsBattedIn}</td>
                          <td>${basesOnBalls}</td>
                          <td>${strikeouts}</td>
                          <td>${prettyBattingAverage}</td>
                          <td>${prettyOnBasePercentage}</td>
                          <td>${prettySluggingPercentage}</td>
                          <td>${onBasePlusSlugging}</td>                      
                              `

            // Populate the stat table
            playerStatTable.innerHTML += `<tr>
                                    <td>${moment(game.gameDate).format('MMM D')}</td>
                                    <td class="opponent-row">
                                      <img class="opponent-image" src="${game.opponentImage}">
                                      <span>${game.opponent}</span>  
                                    </td>
                                    <td>${game.PA}</td>
                                    <td>${game.AB}</td>
                                    <td>${game.H}</td>
                                    <td>${game.HR}</td>
                                    <td>${game.RBI}</td>
                                    <td>${game.BB}</td>
                                    <td>${game.K}</td>
                                    <td>${prettyBattingAverage}</td>
                                    <td>${prettyOnBasePercentage}</td>
                                    <td>${prettySluggingPercentage}</td>
                                    <td>${(onBasePlusSlugging)}</td>
                                  </tr>`
        })
    }

    populateData()
}

// Redraw stat tables and totals every time a date is picked
picker.on('selected', () => {
    drawPage()
})

// Pull data on page load
drawPage()