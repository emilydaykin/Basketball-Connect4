// ------------------------------------------------------------------ //
// ---------------------  Basketball Connect 4  --------------------- //
// ------------------------------------------------------------------ //
// BUGS to fix:
// - when hovering over FIRST (hidden) row, the ball spazzes
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
const vertical = gridWidth;   // +-8
const horizontal = 1;
const diagUp = gridWidth - 1;  // +-7
const diagDown = gridWidth + 1 // +-9
// 8*6 (extra row at the top for ball to hover)
const numOfCells = gridWidth * (gridHeight + 1)

// 0) Create a (flex) grid and 1) show it
function createOrResetGrid() {
  grid.innerHTML = '';  // empty (reset) grid contents
  for (let i = 0; i < numOfCells; i++) {
    let cellDiv = document.createElement('div');
    cellDiv.classList.add('cell');
    cellDiv.setAttribute('data-id', i);
    grid.appendChild(cellDiv);
    if (i < 8) {
      let hoop = document.createElement('img');
      hoop.src = "./images/hoop-cropped.png";
      hoop.alt = "baskteball hoop";
      hoop.classList.add('hoop');
      hoop.setAttribute('id', `hoop-${i}`);
      grid.appendChild(hoop);
    }
  }
}


let modeSelected;  // 1- or 2-player mode
let ballColour = 'orange';  // orange or blue
let cells;  // can only be brought in once html has these
let winner;
let gameStatus;
let turn = 'player'; // or 'computer'
let currentScoreP1 = 0;
let currentScoreP2 = 0;
let scoreUpdated = false;

button2players.addEventListener('click', () => {
  if (!modeSelected) {
    console.log('2-player mode selected!')
    modeSelected = '2player'
    // button2players.disabled = true;
    button2players.id = 'highlight';
    button1player.id = 'unhighlight';
    button1player.classList.remove('flash');
    button2players.classList.remove('flash');
    // disable button for 1 player mode:
    button1player.disabled = true;
    createOrResetGrid();
    cells = document.querySelectorAll('.cell');
    initialiseScoreboard(player1 = 'Player 1', player2 = 'Player 2');
    console.log('===== Playing single game...')
    playGame(cells);
  }
})

button1player.addEventListener('click', () => {
  if (!modeSelected) {
    console.log('1-player mode selected!')
    modeSelected = '1player'
    button1player.id = 'highlight';
    button2players.id = 'unhighlight';
    button1player.classList.remove('flash');
    button2players.classList.remove('flash');
    // disable button for 2 player mode:
    button2players.disabled = true;
    createOrResetGrid();
    cells = document.querySelectorAll('.cell');
    initialiseScoreboard(player1 = 'You', player2 = 'Mysterious Opponent');
    playGame(cells);
  }
})


function initialiseScoreboard(player1, player2) {
  player1Name.innerHTML = `${player1} &nbsp;`;
  player2Name.innerHTML = `&nbsp; ${player2}`;
  player1Score.innerText = 0;
  scoreDivider.innerHTML = '&nbsp; &mdash; &nbsp;';
  player2Score.innerText = 0;
}


function playGame(cells) {
  // 1.75) Declare ball = orange (will switch to blue for other player)
  console.log("TURNNNNNNN:", turn);
  console.log("BAAALLLLL COLOUR:", ballColour);

  winner = null;
  gameStatus = null;  // 'ongoing' or 'ended';

  addEventListenersToEachCell(cells);
  
}

function updateScore() {
  if (winner === 'orange' && !scoreUpdated) {
    currentScoreP1++;
    scoreUpdated = true;
    console.log(`Score is now ${currentScoreP1} for player 1!`)
    player1Score.innerText = currentScoreP1;
  } else if (winner === 'blue' && !scoreUpdated) {
    currentScoreP2++;
    scoreUpdated = true;
    console.log(`Score is now ${currentScoreP2} for player 2!`)
    player2Score.innerText = currentScoreP2;
  } 
}

function ifNewGameClick() {
  newGameBtn.addEventListener('click', () => {
    // Once it can be clicked on (when there is a winner):
    newGameBtn.classList.remove('flash');
    newTournaBtn.classList.remove('flash');
    scoreUpdated = false;
    winnerAnnounced.innerText = '';
    createOrResetGrid();
    cells = document.querySelectorAll('.cell');
    winner = null;
    gameStatus = null;
    // 50-50 chance which player (in 2-player game) goes first:
    if (modeSelected === '1player') {
      turn = 'player';
    } else {  // modeSelected='2player
      ballColour = ['orange', 'blue'][Math.floor(Math.random() * 2)];  // 0 or 1
    }
    playGame(cells);
  })
}

newTournaBtn.addEventListener('click', () => {
  if (window.confirm("Are you sure you want to start a new tournament? This will reset the scoreboard, and you'll have to reselect a game mode.")) {
    window.location.reload();
  }
})

function addEventListenersToEachCell(cells) {
  cells.forEach((cell) => {
    
    cell.addEventListener('mouseover', ballAppearOnTop);
    cell.addEventListener('mouseleave', ballDisappearOnTop);
    // cell.addEventListener('click', (event) => {
    //   console.log('clicked');
    //   const cellNum = event.target.getAttribute('data-id');
    //   console.log('cell number:', cellNum);
    //   const colNum = event.target.getAttribute('data-id') % 8;
    //   console.log('column number:', colNum);
    // });

    cell.addEventListener('click', verifyPlaceCheck);

  })
}



function checkGameStatus() {
  console.log('CHECK GAME STATUS CALLED')
  if (winner) {
    // scoreUpdated = false;
    gameStatus = 'ended';
    newGameBtn.disabled = false;
    newTournaBtn.disabled = false;
    console.log('WE HAVE A WINNER');
    turn = modeSelected === '2player' ? 'player' : null;
    console.log('===== Updating score...')
    updateScore();
    // flash the new game/tourni buttons:
    newGameBtn.classList.add('flash');
    newTournaBtn.classList.add('flash');
    ifNewGameClick();
    } else {
    gameStatus = 'ongoing';
    console.log('no winner yet....');
    newGameBtn.disabled = true;
  }
}


function computerToMoveNext() {
  console.log('TURN INSIDE CTMX function:', turn);
  if (turn==='computer') {
    // Randomised choice
    colNum = Math.floor(Math.random() * 8);
    // Smart choice:
    // -- to be implemented later --
    // verifyPlaceCheckMANPOWER(colNum);
    let firstAvailableCell = verify(colNum);
    if (firstAvailableCell) {
      slideAndplace(colNum, firstAvailableCell);
    }
  }
}

function ballAppearOnTop(event) {
  if (!winner && turn === 'player') {
    const colNum = event.target.getAttribute('data-id') % 8;
    document.querySelector(`div[data-id='${colNum}']`).classList.add(`hovered-${ballColour}`)
  }
}
function ballDisappearOnTop(event) {
  const colNum = event.target.getAttribute('data-id') % 8;
  
  // document.querySelector(`div[data-id='${colNum}']`).classList.remove(`hovered-${ballColour}`);
  document.querySelector(`div[data-id='${colNum}']`).classList.remove(`hovered-orange`);
  document.querySelector(`div[data-id='${colNum}']`).classList.remove(`hovered-blue`);
}

function verifyPlaceCheck(event) {
  // gameStatus = 'ongoing';
  if (gameStatus !== 'ended') {  // 'null' or 'ongoing'
    if (!winner) {
      let colNum = event.target.getAttribute('data-id') % 8;
      let firstAvailableCell = verify(colNum);
      if (firstAvailableCell) {
        slideAndplace(colNum, firstAvailableCell);
        computerToMoveNext();
      }
    } 
  }
  console.log('GAME-STATUS:', gameStatus)
}

function verify(columnNumber) {
  const colContents = gridOverview.columns[`column${columnNumber}`].sort((a, b) => b - a);  // modifies original gridOverview
  // console.log(`colContents of col ${columnNumber}: ${colContents}`);

  // Get first available cell in that column:
  let firstAvailableCell = colContents.find((cell) => {
    return !document.querySelector(`div[data-id='${cell}']`).classList.contains('filled');
  })

  if (!firstAvailableCell) {
    console.log('column FULL!');
    computerToMoveNext();  // get the computer to choose another col
  } else {
    return columnNumber, firstAvailableCell;
  }
}

function slideAndplace(columnNumber, firstAvailableCell) {
  console.log('firstAvailableCell:', firstAvailableCell);
  let cellToFill = document.querySelector(`div[data-id='${firstAvailableCell}']`);
  
  // Get position of ball-start (top hidden row cell)
  startingCell = document.querySelector(`div[data-id='${columnNumber}']`)
  let xPositionStart = startingCell.getBoundingClientRect().left
  let yPositionStart = startingCell.getBoundingClientRect().top
  
  let xPositionEnd = cellToFill.getBoundingClientRect().left  // SAME AS START!
  let yPositionEnd = cellToFill.getBoundingClientRect().top
  
  let looseBall = ballColour === 'orange' ? looseBallOrange : looseBallBlue;

  console.log('looseBall', looseBall);
  console.log('ballColour', ballColour);

  looseBall.classList.remove('hide');
  looseBall.style.top = `${yPositionStart + 1}px`;
  looseBall.style.left = `${xPositionStart + 9}px`;
  
  function slideBall() {
    document.querySelector(`div[data-id='${columnNumber}']`).classList.remove(`hovered-orange`);
    document.querySelector(`div[data-id='${columnNumber}']`).classList.remove(`hovered-blue`);
    cells.forEach((cell) => {
      cell.removeEventListener('mouseover', ballAppearOnTop);
      cell.removeEventListener('mouseleave', ballDisappearOnTop);
    });
        
    yPositionStart+=4;
    looseBall.style.top = `${yPositionStart + 1}px`;
    
    if (yPositionStart > yPositionEnd) {
      clearInterval(slide);
      cellToFill.classList.add('filled');
      console.log('ball colour to fill:', ballColour);
      // ballColourTmp = ballColour === 'orange' ? 'blue' : 'orange';
      cellToFill.setAttribute('id', ballColour); // VERY hacky fix - terrible - also breaks the win logic;
      // ^ above two lines are due to the ball colour changing before it gets placed from set interval
      looseBall.classList.add('hide');
      // cellToFill.classList.add('ball-drop-animation');
      checkForAWin(columnNumber, firstAvailableCell);
      checkGameStatus();
      computerToMoveNext();
      
      cells.forEach((cell) => {
        cell.addEventListener('mouseover', ballAppearOnTop);
        cell.addEventListener('mouseleave', ballDisappearOnTop);
      })
    }
  }
  let slide = setInterval(slideBall, 1);  
}


function getWinnerDeclaration() {
  if (modeSelected === '1player') {
    winnerAnnounced.innerText = `${ballColour === 'orange' ? 'You are' : 'Your mysterious opponent is'} the WINNER!!!`;
  } else {
    winnerAnnounced.innerText = `${ballColour === 'orange' ? 'Player 1' : 'Player 2'} is the WINNER!!!`;
  }
}

function checkForAWin(columnNumber, firstAvailableCell) {
  
  // STEP 4 here:
  const lastPlayedCell = firstAvailableCell; // 4.0.1
  console.log('columnNumber', columnNumber);
  console.log('firstAvailableCell', firstAvailableCell);
  // 4.0.2
  const rowNum = Math.floor(lastPlayedCell / 8) - 1;
  const diagUpNum = (lastPlayedCell - 11) % 7;
  const diagDownNum = (lastPlayedCell - 7) % 9;
  console.log(`Last played cell is: Row ${rowNum}, Col ${columnNumber}, DiagUp ${diagUpNum} and DiagDown ${diagDownNum}`);
  // 4.0.3
  const colCells = gridOverview.columns[`column${columnNumber}`];
  const rowCells = gridOverview.rows[`row${rowNum}`];
  let diagUpCells = (diagUpNum >= 0 && diagUpNum < 6) ? gridOverview.diagonalUphill[`diagUp${diagUpNum}`] : null;
  // safety check: since (16-11)%7=5, but should be null
  // (this is not a problem for diagDown)
  if (diagUpCells && !diagUpCells.includes(lastPlayedCell)) {
    diagUpCells = null;
  }
  const diagDownCells = (diagDownNum >= 0 && diagDownNum < 6) ? gridOverview.diagonalDownhill[`diagDown${diagDownNum}`] : null;
  console.log(`Contents of last placed cell: row ${rowCells}, col ${colCells}, diagUp ${diagUpCells} and diagDown ${diagDownCells}`)

  // IF MORE THAN 6 CELLS FILLED IN WHOLE GRID:
  // 4.0.4: Get all cell numbers that have ballColour ids:
  const playerXElements = document.querySelectorAll(`#${ballColour}`);
  // console.log(`all ${ballColour} elements: ${playerXElements}`);
  // To map over nodelist: first convert to array:
  // const playerXCells = Array.from(playerXElements).map((element) => element.dataset.id);
  const playerXCells = [...playerXElements].map((element) => element.dataset.id);
  console.log(`${ballColour} Cells: ${playerXCells}`);
  // ----- 4.0.5) ----- //
  let winningCells;
  // horizontal check:  // will always have row contents
  console.log('orangeCells:', playerXCells, 'row cells:', rowCells)
  let xxx = rowCells.filter((rowCell) => playerXCells.includes(String(rowCell))).sort((a, b) => a - b);
  console.log('xxx', xxx);
  let differences = [];
  for (let i = 0; i < xxx.length - 1; i++) {
    differences.push(xxx[i + 1] - xxx[i]);
  }
  // Match consecutive 1s precisely 3 or more times:
  const regex = /1{3,}/g;
  if (differences.join('').match(regex) >= 1) {
    console.log('differences joined', differences.join(''));
    console.log(`${ballColour} is the WINNER!!! (horizontal)`);
    getWinnerDeclaration()
    winner = ballColour;
    // get winning cells:
    /// get array of the string of differences split by 3+ consecutive ones:
    const tmp = differences.join('').split(regex);
    // if '111'+ exists, array will be of length 2 (grid is only 8 long, so can't be >2 here, but theoretically yes). if not found, could be -1.        
    if (typeof (tmp) === 'object' && tmp.length === 2) { // winner
      // 4-in-a-row = first 4 or first 7
      if ((tmp[0] === '' && tmp[1] === '') || tmp[0] === '') {
        winningCells = xxx.slice(0, 4);
      } else if (tmp[1] == '') {  // 4-in-a-row = last 4
        winningCells = xxx.slice(-4);
      } else {  // 4-in-a-row: middle 4
        winningCells = xxx.slice(1, xxx.length - 1);
      }
    }
    console.log('winningCells', winningCells);
  }
  if (!winner) {
    // vertical check:  // will always have column contents
    console.log('orangeCells:', playerXCells, 'col cells:', colCells)
    xxx = colCells.filter((colCell) => playerXCells.includes(String(colCell))).sort((a, b) => a - b);
    console.log('xxx', xxx);
    if (xxx.length === 4 && xxx[xxx.length - 1] - xxx[0] === 24) {
      console.log(`${ballColour} is the WINNER!!! (vertical)`);
      getWinnerDeclaration();
      winner = ballColour;
      winningCells = xxx.slice(0, 4);
      console.log('winningCells', winningCells);
    }
  }
  // might not have a corresponding updiag if < 4
  if (!winner && diagUpCells) {
    console.log('orangeCells:', playerXCells, 'diagUp cells:', diagUpCells)
    xxx = diagUpCells.filter((diagUpCell) => playerXCells.includes(String(diagUpCell))).sort((a, b) => a - b);
    console.log('xxx', xxx);
    if ((xxx.length === 4 && xxx[xxx.length - 1] - xxx[0] === 21) || (xxx.length === 5 && xxx[xxx.length - 1] - xxx[0] === 28)) {
      console.log(`${ballColour} is the WINNER!!! (diagUp)`);
      getWinnerDeclaration();
      winner = ballColour;
      winningCells = xxx.slice(0, 4);
      console.log('winningCells', winningCells);
    }
  }
  // might not have a corresponding downdiag if < 4
  if (!winner && diagDownCells) {
    console.log('orangeCells:', playerXCells, 'diagDown cells:', diagDownCells)
    xxx = diagDownCells.filter((diagDownCell) => playerXCells.includes(String(diagDownCell))).sort((a, b) => a - b);
    console.log('xxx', xxx);
    if ((xxx.length === 4 && xxx[xxx.length - 1] - xxx[0] === 27) || (xxx.length === 5 && xxx[xxx.length - 1] - xxx[0] === 36)) {
      console.log(`${ballColour} is the WINNER!!! (diagDown)`);
      getWinnerDeclaration();
      winner = ballColour;
      winningCells = xxx.slice(0, 4);
      console.log('winningCells', winningCells);
    }
  }
  // after clicked, make hovered ball (top row) disappear:
  // document.querySelector(`div[data-id='${columnNumber}']`).classList.remove(`hovered-${ballColour}`);
  document.querySelector(`div[data-id='${columnNumber}']`).classList.remove(`hovered-orange`);
  document.querySelector(`div[data-id='${columnNumber}']`).classList.remove(`hovered-blue`);
  

  
  let totalCellsFilled = document.querySelectorAll('.filled').length;
  console.log('totalCellsFilled', totalCellsFilled)
  console.log('totalCellsFilled', totalCellsFilled.length)  
  // Other player turn: change ball colour;
  // if no winner and board not filled:
  if (!winner && totalCellsFilled < 40) {
    ballColour = ballColour === 'orange' ? 'blue' : 'orange';
    console.log(`ballColour now changed to ${ballColour.toUpperCase()} for next turn`);
    console.log('MODE SELECTED', modeSelected);
    if (modeSelected === '1player') {
      console.log('TURN WAS:', turn);
      turn = turn === 'player' ? 'computer' : 'player';
      console.log('TURN IS NOW:', turn);
    }
  } else if (winner) {  // if there IS a winner, make the ball orange for the next game:
    gameStatus = 'ended';
    ballColour = 'orange';
    // Pulsate the winning 4 cells!:
    winningCells.forEach((winningCell) => {
      document.querySelector(`div[data-id='${winningCell}']`).classList.add('pulsate')
    })
  } else if (totalCellsFilled === 40) {
    console.log("It's a draw!");
    winnerAnnounced.innerText = `It's a draw!`;

  }
}
