// ------------------------------------------------------------------ //
// ---------------------  Basketball Connect 4  --------------------- //
// ------------------------------------------------------------------ //
// BUGS to fix:
// - MAGICALLY FIXED: when hovering over FIRST (hidden) row, the ball spazzes
// - after cell clicked, if mouse stays on same cell, ball doesnt 
//   appear at the top
// - if user double clicks many times (while interval slide still
//   going), many turns get played in same cell.


const grid = document.querySelector('.grid');
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
// let currentScoreP1 = 0;
// let currentScoreP2 = 0;
let scoreUpdated = false;

// INSTANTIATE GAME CLASS:
const game = new Game(grid);

const setUpTheGame = (selectedMode) => {
    modeSelected = selectedMode
    if (selectedMode === '1player') {
      modeSelected = '1player'
      button1player.id = 'highlight';
      button2players.id = 'unhighlight';      
      button2players.disabled = true;
      game.initialiseScoreboard(player1 = 'You', player2 = 'Mysterious Opponent');
    } else {
      modeSelected = '2player'
      button2players.id = 'highlight';
      button1player.id = 'unhighlight';
      button1player.disabled = true;
      game.initialiseScoreboard(player1 = 'Player 1', player2 = 'Player 2');
    }
    button1player.classList.remove('flash');
    button2players.classList.remove('flash');
    game.createOrResetGrid();
    cells = document.querySelectorAll('.cell');
    game.playGame(cells);
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
    game.createOrResetGrid();
    cells = document.querySelectorAll('.cell');
    winner = null;
    gameStatus = null;
    // 50-50 chance which player (of 2-player game) goes first:
    if (modeSelected === '1player') {
      turn = 'player';
    } else {  // modeSelected='2player
      ballColour = ['orange', 'blue'][Math.floor(Math.random() * 2)];
    }
    game.playGame(cells);
  })
}

newTournaBtn.addEventListener('click', () => {
  const text = "Are you sure you want to start a new tournament? \nThis will reset the scoreboard, and you'll have to re-select a game mode."
  if (window.confirm(text)) {
    window.location.reload();
  }
})


