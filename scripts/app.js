// ------------------------------------------------------------------ //
// ---------------------  Basketball Connect 4  --------------------- //
// ------------------------------------------------------------------ //
// BUGS to fix:
// - MAGICALLY FIXED: when hovering over FIRST (hidden) row, the ball spazzes
// - after cell clicked, if mouse stays on same cell, ball doesnt 
//   appear at the top


const grid = document.querySelector('.grid');
const gameWrapper = document.querySelector('.game');
const button1player = document.querySelector('.mode1player');
const button2players = document.querySelector('.mode2players');
const winnerAnnounced = document.querySelector('.winner-announced');
const newGameBtn = document.querySelector('.new-game');
const newTournaBtn = document.querySelector('.new-tournament');
const player1Name = document.querySelector('.player1Name');
const player2Name = document.querySelector('.player2Name');
const player1Score = document.querySelector('.p1');
const player2Score = document.querySelector('.p2');
const scoreDivider = document.querySelector('.score-divider');
const looseBallOrange = document.querySelector('.orange-ball');
const looseBallBlue = document.querySelector('.blue-ball');
const jordan = document.querySelector('.jordan');
const kobe = document.querySelector('.kobe');
const silhouette = document.querySelector('.silhouette');
// const swishAudio = document.querySelector('audio');

// Declare fixed variables
const gridWidth = 8;
const gridHeight = 5;
// const vertical = gridWidth;   // +-8
// const horizontal = 1;
// const diagUp = gridWidth - 1;  // +-7
// const diagDown = gridWidth + 1 // +-9
// 8*6 (extra row at the top for ball to hover)
const numOfCells = gridWidth * (gridHeight + 1)


let modeSelected;  // 1- or 2-player mode
let ballColour = 'orange';  // orange or blue
let cells;  // can only be brought in once html has these
let winner;
let gameStatus;
let turn = 'player'; // or 'computer'
let scoreUpdated = false;

// INSTANTIATE GAME CLASS:
const connectFour = new Game(grid);

const setUpTheGame = (selectedMode) => {
  if (!modeSelected) {  // if already selected, can't be clicked again
    modeSelected = selectedMode;
    if (selectedMode === '1player') {
      modeSelected = '1player'
      button1player.id = 'highlight';
      button2players.id = 'unhighlight';      
      button2players.disabled = true;
      button1player.classList.remove('hover');
      connectFour.initialiseScoreboard(player1 = 'You', player2 = 'Mysterious Opponent');
    } else {
      modeSelected = '2player'
      button2players.id = 'highlight';
      button1player.id = 'unhighlight';
      button1player.disabled = true;
      button2players.classList.remove('hover');
      connectFour.initialiseScoreboard(player1 = 'Player 1', player2 = 'Player 2');
    }
    cleanUpButtons();
    connectFour.createOrResetGrid();
    gameWrapper.style.backgroundColor = '#000';
    grid.style.backgroundImage = "url('../images/court_bball4_new.jpeg')";
    gameWrapper.style.animation = 'fadein 1s';
    connectFour.displayHoops();
    connectFour.displayPlayerImages();
    cells = document.querySelectorAll('.cell');
    connectFour.playGame(cells);
  }
}


button1player.addEventListener('click', () => setUpTheGame('1player'));
button2players.addEventListener('click', () => setUpTheGame('2player'));


const ifNewGameClickAllowed = () => {
  newGameBtn.addEventListener('click', () => {
    // Once it can be clicked on (when there is a winner):
    newGameBtn.classList.remove('flash');
    newTournaBtn.classList.remove('flash');
    scoreUpdated = false;
    winnerAnnounced.innerText = '';
    connectFour.createOrResetGrid();
    connectFour.displayHoops();
    connectFour.displayPlayerImages();
    cells = document.querySelectorAll('.cell');
    winner = null;
    gameStatus = null;
    // 50-50 chance which player (of 2-player game) goes first:
    if (modeSelected === '1player') {
      turn = 'player';
    } else {  // modeSelected='2player
      ballColour = ['orange', 'blue'][Math.floor(Math.random() * 2)];
    }
    connectFour.playGame(cells);
  })
}

newTournaBtn.addEventListener('click', () => {
  const text = "Are you sure you want to start a new tournament? \nThis will reset the scoreboard, and you'll have to re-select a game mode."
  if (window.confirm(text)) {
    window.location.reload();
  }
})

function cleanUpButtons() {
  button1player.classList.remove('flash');
  button2players.classList.remove('flash');
  button1player.classList.remove('start');
  button2players.classList.remove('start');
}

