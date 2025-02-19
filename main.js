// #region GAME LOGIC AND DATA

//DATA
let clickCount = 0
let height = 120
let width = 100
let inflationRate = 20
let maxsize = 300
let highestPopCount = 0
let currentPopCount = 0
let gameLength = 10000
let clockId = 0
let timeRemaining = 0
let currentPlayer = {}
let currentColor = "red"
let possibleColors = ["red", "green", "blue", "purple", "pink"]

function startGame() {
  // @ts-ignore
  document.getElementById("game-controls").classList.remove("hidden")
  // @ts-ignore
  document.getElementById("main-controls").classList.add("hidden")
  // @ts-ignore
  document.getElementById("scoreboard").classList.add("hidden")
  startClock()
  setTimeout(stopGame, gameLength)
}

function startClock() {
  timeRemaining = gameLength
  drawClock()
  clockId = setInterval(drawClock, 1000)
}

function stopClock() {
  clearInterval(clockId)
}

function drawClock() {
  let countdownElem = document.getElementById("countdown")
  // @ts-ignore
  countdownElem.innerText = (timeRemaining / 1000).toString()
  timeRemaining -= 1000
}

function inflate() {
  clickCount++
  height += inflationRate
  width += inflationRate
  checkBalloonPop()
  draw()
}

function checkBalloonPop() {
  if (height >= maxsize) {
    console.log("pop the balloon")
    let balloonElement = document.getElementById("balloon")
    // @ts-ignore
    balloonElement.classList.remove(currentColor)
    getRandomColor()
    // @ts-ignore
    balloonElement.classList.add(currentColor)

    // @ts-ignore
    document.getElementById("pop-sound").play()

    currentPopCount++
    height = 40
    width = 0
  }
}

function getRandomColor() {
  let i = Math.floor(Math.random() * possibleColors.length);
  currentColor = possibleColors[i]
}

function draw() {
  let balloonElement = document.getElementById("balloon")
  let clickCountElem = document.getElementById("click-count")
  let popCountElem = document.getElementById("pop-count")
  let highPopCountElem = document.getElementById("high-pop-count")
  let playerNameElem = document.getElementById("player-name")


  // @ts-ignore
  balloonElement.style.height = height + "px"
  // @ts-ignore
  balloonElement.style.width = width + "px"

  // @ts-ignore
  clickCountElem.innerText = clickCount.toString()
  // @ts-ignore
  popCountElem.innerText = currentPopCount.toString()
  // @ts-ignore
  highPopCountElem.innerText = currentPlayer.topScore.toString()

  // @ts-ignore
  playerNameElem.innerText = currentPlayer.name
}

function stopGame() {
  console.log("the game is over")

  // @ts-ignore
  document.getElementById("main-controls").classList.remove("hidden")
  // @ts-ignore
  document.getElementById("scoreboard").classList.remove("hidden")
  // @ts-ignore
  document.getElementById("game-controls").classList.add("hidden")

  clickCount = 0
  height = 120
  width = 100

  if (currentPopCount > currentPlayer.topScore) {
    currentPlayer.topScore = currentPopCount
    savePlayers()
  }
  currentPopCount = 0

  stopClock()
  draw()
  drawScoreboard()
}

// #endregion

let players = []
loadPlayers()

function setPlayer(event) {
  event.preventDefault()
  let form = event.target

  let playerName = form.playerName.value

  currentPlayer = players.find(player => player.name == playerName)

  if (!currentPlayer) {
    currentPlayer = { name: playerName, topScore: 0 }
    players.push(currentPlayer)
    savePlayers()
  }

  form.reset()
  document.getElementById("game")?.classList.remove("hidden")
  form.classList.add("hidden")
  draw()
  drawScoreboard()
}

function changePlayer() {
  // @ts-ignore
  document.getElementById("player-form").classList.remove("hidden")
  // @ts-ignore
  document.getElementById("game").classList.add("hidden")
}

function savePlayers() {
  window.localStorage.setItem("players", JSON.stringify(players))
}

function loadPlayers() {
  // @ts-ignore
  let playersData = JSON.parse(window.localStorage.getItem("players"))
  if (playersData) {
    players = playersData
  }
}

function drawScoreboard() {
  let template = ""

  players.sort((p1,p2) => p2.topScore - p1.topScore)

  players.forEach(player => {
    template += `
    <div class="d-flex space-between">
        <span>
          <i class="fa fa-user"></i>
          ${player.name}
        </span>
        <span>Score: ${player.topScore} </span>
      </div>
    `
  })

  // @ts-ignore
  document.getElementById("players").innerHTML = template
}

drawScoreboard()