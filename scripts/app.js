// ------------------------------------------------------------------ //
// ---------------------  Basketball Connect 4  --------------------- //
// ------------------------------------------------------------------ //
// BUGS to fix:
// - when hovering over FIRST (hidden) row, the ball spazzes
// - after cell clicked, if mouse stays on same cell, ball doesnt 
//   appear at the top

// document.getElementById('my-input-id').disabled = false;
// button2players.disabled = false;

const grid = document.querySelector('.grid');
const button1player = document.querySelector('.mode1player');
const button2players = document.querySelector('.mode2players');
const winnerAnnounced = document.querySelector('.winner-announced');
const newGameBtn = document.querySelector('.new-game');

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
  }
}

createOrResetGrid();

let cells = document.querySelectorAll('.cell');  // can only be brought in once html has these

// 1.25) Create an overview of the grid
// this should probably be written programmatically 
const gridOverview = {
  columns: {
    // column number = cellNum % 8
    column0: [8, 16, 24, 32, 40],  // left-most col
    column1: [9, 17, 25, 33, 41],
    column2: [10, 18, 26, 34, 42],
    column3: [11, 19, 27, 35, 43],
    column4: [12, 20, 28, 36, 44],
    column5: [13, 21, 29, 37, 45],
    column6: [14, 22, 30, 38, 46],
    column7: [15, 23, 31, 39, 47],  // right-most col
  },
  rows: {
    // row num = Math.floor(cellNum / 8) - 1
    row0: [8, 9, 10, 11, 12, 13, 14, 15],  // top row
    row1: [16, 17, 18, 19, 20, 21, 22, 23],
    row2: [24, 25, 26, 27, 28, 29, 30, 31],
    row3: [32, 33, 34, 35, 36, 37, 38, 39],
    row4: [40, 41, 42, 43, 44, 45, 46, 47],  // bottom row
  },
  diagonalUphill: {  // y=x
    // diagUpnum = (cellNum-11) % 7
    diagUp0: [11, 18, 25, 32],  // first one from left with >=4
    diagUp1: [12, 19, 26, 33, 40],
    diagUp2: [13, 20, 27, 34, 41],
    diagUp3: [14, 21, 28, 35, 42],
    diagUp4: [15, 22, 29, 36, 43],
    diagUp5: [23, 30, 37, 44],
  },
  diagonalDownhill: {  // y=-x
    // diagDownnum = (cellNum-7) % 9
    diagDown0: [16, 25, 34, 43],  // first one from left with >=4
    diagDown1: [8, 17, 26, 35, 44],
    diagDown2: [9, 18, 27, 36, 45],
    diagDown3: [10, 19, 28, 37, 46],
    diagDown4: [11, 20, 29, 38, 47],
    diagDown5: [12, 21, 30, 39],
  }
}

// 1.5) Add event listeners to HTML buttons (1-player mode or 2-player mode)
//       --- User (orange) always goes first ---
//       If 2-player mode clicked, PLAY ENTIRE GAME (steps 2-6)
//       If 1-player mode clicked, PLAY ENTIRE GAME (steps 2-6) with computer generated moves
let modeSelected;
button1player.addEventListener('click', () => {
  if (!modeSelected) {
    console.log('1-player mode selected!')
    modeSelected = '1player'
    // disable button for two player mode:
    button2players.disabled = true;
  }
})

button2players.addEventListener('click', () => {
  if (!modeSelected) {
    console.log('2-player mode selected!')
    modeSelected = '2player'
    // disable button for two player mode:
    button1player.disabled = true;
  }
})


// 1.75) Declare ball = orange (will switch to blue for other player)
let ballColour = 'orange';

// 2) Add an event listener to each column of the grid - console log 
//    the column of grid clicked on. 
    // cellNum % 8 === 0 ==> col 0
    // ? Will the event listener will be on entire grid (and event.target
    // ? will give cell number)? Or have the event listener on each cell?
    // ? hmm probs latter...
    // Wrap each entire turn inside event listener (steps 3 & 4)

let winner;
let gameStatus;  // 'ongoing' or 'ended';

function addEventListenersToEachCell() {
  cells.forEach((cell) => {
    
    cell.addEventListener('mouseover', ballAppearOnTop);
    cell.addEventListener('mouseleave', ballDisappearOnTop);
    cell.addEventListener('click', (event) => {
      console.log('clicked');
      const cellNum = event.target.getAttribute('data-id');
      console.log('cell number:', cellNum);
      const colNum = event.target.getAttribute('data-id') % 8;
      console.log('column number:', colNum);
    });
    cell.addEventListener('click', verifyPlaceCheck);
    cell.addEventListener('click', checkGameStatus);
  })
}
addEventListenersToEachCell();


function checkGameStatus() {
  if (winner) {
    gameStatus = 'ended';
    newGameBtn.disabled = false;
    console.log('WE HAVE A WINNER');
  } else {
    gameStatus = 'ongoing';
    console.log('no winner yet....');
    newGameBtn.disabled = true;
  }
}

function ballAppearOnTop(event) {
  if (!winner) {
    const colNum = event.target.getAttribute('data-id') % 8;
    document.querySelector(`div[data-id='${colNum}']`).classList.add(`hovered-${ballColour}`)
  }
}
function ballDisappearOnTop(event) {
  const colNum = event.target.getAttribute('data-id') % 8;
  document.querySelector(`div[data-id='${colNum}']`).classList.remove(`hovered-${ballColour}`);
}

// FUNCTION FOR STEP 3
// 3) Check if that column is already partially filled (if the bottom 
//    row of that col is filled, then if second bottom, etc...)
//      - if all rows filled (all have a class of filled), clicking on 
//        that column won't pull ball in
//      - if partially filled (looping through row finds one without a 
//        'filled' class), get the first empty cell number and add the 
//        ball there - ANIMATE KEYFRAME to have the ball slide down to 
//        the first empty cell
// if column 0 selected: check if cell 40 is filled
//                            (classList.contains('filled')?)
//                       if no, put ball there --> cell 40 display ball
//                            (cell40=filled)
//                       if yes, then check if 32 is filled ...

function verifyPlaceCheck(event) {
  if (!winner) {
    const colNum = event.target.getAttribute('data-id') % 8;
    // Doing STEP 3 here:
    const colContents = gridOverview.columns[`column${colNum}`].sort((a,b)=>b-a);  // modifies original gridOverview
    console.log(`colContents of col ${colNum}: ${colContents}`);
    // Get first available cell in that column:
    
    let firstAvailableCell = colContents.find((cell) => {
      return !document.querySelector(`div[data-id='${cell}']`).classList.contains('filled');
    })
  
    if (!firstAvailableCell) {
      console.log('column FULL!')
    } else {
      console.log('firstAvailableCell:', firstAvailableCell);
      let cellToFill = document.querySelector(`div[data-id='${firstAvailableCell}']`);
      cellToFill.classList.add('filled');
      cellToFill.setAttribute('id', ballColour);
  
      // Doing STEP 4 here:
      const lastPlayedCell = firstAvailableCell; // 4.0.1
      // 4.0.2
      const rowNum = Math.floor(lastPlayedCell / 8) - 1;
      const diagUpNum = (lastPlayedCell - 11) % 7;
      const diagDownNum = (lastPlayedCell - 7) % 9;
      console.log(`Last played cell is: Row ${rowNum}, Col ${colNum}, DiagUp ${diagUpNum} and DiagDown ${diagDownNum}`);
      // 4.0.3
      const colCells = gridOverview.columns[`column${colNum}`];
      const rowCells = gridOverview.rows[`row${rowNum}`];
      let diagUpCells = diagUpNum < 6 ? gridOverview.diagonalUphill[`diagUp${diagUpNum}`] : null;
      // safety check: since (16-11)%7=5, but should be null
      // (this is not a problem for diagDown)
      if (diagUpCells && !diagUpCells.includes(lastPlayedCell)) {
        diagUpCells = null;
      }
      const diagDownCells = diagDownNum < 6 ? gridOverview.diagonalDownhill[`diagDown${diagDownNum}`] : null;
      console.log(`Contents of last placed cell: row ${rowCells}, col ${colCells}, diagUp ${diagUpCells} and diagDown ${diagDownCells}`)
  
      // IF MORE THAN 6 CELLS FILLED IN WHOLE GRID:
      // 4.0.4: Get all cell numbers that have ballColour ids:
      const playerXElements = document.querySelectorAll(`#${ballColour}`);
      // console.log(`all ${ballColour} elements: ${playerXElements}`);
      // To map over nodelist: first convert to array:
      const playerXCells = Array.from(playerXElements).map((element) => element.dataset.id);
      console.log(`${ballColour} Cells: ${playerXCells}`);
      // ----- 4.0.5) ----- //
      let winningCells;
      // horizontal check:  // will always have row contents
      console.log('orangeCells:', playerXCells, 'row cells:', rowCells)
      let xxx = rowCells.filter((rowCell) => playerXCells.includes(String(rowCell))).sort();
      console.log(xxx)
      let differences = [];
      for (let i = 0; i < xxx.length-1; i++) {
        differences.push(xxx[i+1]-xxx[i]);
      }
      // Match consecutive 1s precisely 3 or more times:
      const regex = /1{3,}/g;
      if (differences.join('').match(regex) >= 1) {
        console.log('differences joined', differences.join(''));
        console.log(`${ballColour} is the WINNER!!! (horizontal)`);
        winnerAnnounced.innerText = `${ballColour} is the WINNER!!! (horizontal)`;
        winner = ballColour;
        // get winning cells:
        /// get array of the string of differences split by 3+ consecutive ones:
        const tmp = differences.join('').split(regex);
        // if '111'+ exists, array will be of length 2 (grid is only 8 long, so can't be >2 here, but theoretically yes). if not found, could be -1.        
        if (typeof(tmp)==='object' && tmp.length === 2) { // winner
          // 4-in-a-row = first 4 or first 7
          if ((tmp[0] === '' && tmp[1] === '') || tmp[0] === '') {  
            winningCells = xxx.slice(0, 4);
          } else if (tmp[1] == '') {  // 4-in-a-row = last 4
            winningCells = xxx.slice(-4);
          } else {  // 4-in-a-row: middle 4
            winningCells = xxx.slice(1, xxx.length-1);
          }
        }
        console.log('winningCells', winningCells);
      } 
      if (!winner) {
        // vertical check:  // will always have column contents
        console.log('orangeCells:', playerXCells, 'col cells:', colCells)
        xxx = colCells.filter((colCell) => playerXCells.includes(String(colCell))).sort();
        console.log(xxx)
        if (xxx.length === 4 && xxx[xxx.length - 1] - xxx[0] === 24) {
          console.log(`${ballColour} is the WINNER!!! (vertical)`);
          winnerAnnounced.innerText = `${ballColour} is the WINNER!!! (vertical)`;
          winner = ballColour;
          winningCells = xxx.slice(0, 4);
          console.log('winningCells', winningCells);
        }
      }
      // might not have a corresponding updiag if < 4
      if (!winner && diagUpCells) {  
        console.log('orangeCells:', playerXCells, 'diagUp cells:', diagUpCells)
        xxx = diagUpCells.filter((diagUpCell) => playerXCells.includes(String(diagUpCell))).sort();  
        if ((xxx.length === 4 && xxx[xxx.length - 1] - xxx[0] === 21) || (xxx.length === 5 && xxx[xxx.length - 1] - xxx[0] === 28)) {
          console.log(`${ballColour} is the WINNER!!! (diagUp)`);
          winnerAnnounced.innerText = `${ballColour} is the WINNER!!! (diagUp)`;
          winner = ballColour;
          winningCells = xxx.slice(0, 4);
          console.log('winningCells', winningCells);
        } 
      }
      // might not have a corresponding downdiag if < 4
      if (!winner && diagDownCells) {  
        console.log('orangeCells:', playerXCells, 'diagDown cells:', diagDownCells)
        xxx = diagDownCells.filter((diagDownCell) => playerXCells.includes(String(diagDownCell))).sort();    
        if ((xxx.length === 4 && xxx[xxx.length - 1] - xxx[0] === 27) || (xxx.length === 5 && xxx[xxx.length - 1] - xxx[0] === 36)) {
          console.log(`${ballColour} is the WINNER!!! (diagDown)`);
          winnerAnnounced.innerText = `${ballColour} is the WINNER!!! (diagDown)`;
          winner = ballColour;
          winningCells = xxx.slice(0,4);
          console.log('winningCells', winningCells);
        }
      }
      // after clicked, make hovered ball (top row) disappear:
      document.querySelector(`div[data-id='${colNum}']`).classList.remove(`hovered-${ballColour}`);
      
      // Other player turn: change ball colour;
      if (!winner) {
        ballColour = ballColour==='orange' ? 'blue' : 'orange';
        console.log('ballColour', ballColour)
      } else {  // if there IS a winner, make the ball orange for the next game:
        ballColour = 'orange';
        // Pulsate the winning 4 cells!:
        winningCells.forEach((winningCell) => {
          document.querySelector(`div[data-id='${winningCell}']`).classList.add('pulsate')
        })
      }

    }
  }
} 


    // FUNCTION
// 4) !! Call win logic: to check whether the grid has any 4-balls-in-a-row !!
    // -- if entire grid has > 6 filled, filter for only orange (or
    //    blue) and see if gridOverview.inclues(filteredOrange)

    // 4.0.1) Get last played cell number (where most recent turn placed the ball)
    // 4.0.2) Work out the column number, row number, diagUp number and diagDown
    //        number of that
    // 4.0.3) Get the contents of the col/row/diag numbers from gridOverview
    // 4.0.4) Get all the cell numbers that have the class of orange (or blue):
    //        const orangeCells = document.querySelectorAll('.orange')
    //                                    .getAttribute('data-id')
    // 4.0.5) Use 4.0.3 and 4.0.4 to do:
              // function for adjacent:
              //  IF array.length === 4 and x = sorted array.
              //   horizontal: x[3] - x[0] === 3
              //   vertical: x[3] - [0] === 24
              //   diagUp(y = x): x[3] - x[0] === 21
              //   diagDown(y = -x): x[3] - x[0] === 27
              //  THEN: they're 4 in a row!
              // adding a generalised check for 5-6 in a row so it doesn't break:
    // ----- HORIZONTAL-----
    //    const xxx = set(...[arrayOfAllOrangeCellNums], ...[arrayOfItsRowNumbers])
    //    if xxx.length >= 4 &&
    //      (adjacent: sortedArrayLast - sortedArrayFirst===(xxx.length-1))
    //      ==>  WINNER!
    // ----- VERTICAL -----
    //    const xxx = set(...[arrayOfAllOrangeCellNums], ...[arrayOfItsColumnNumbers])
          // can never be 5 of the same colour
    //    if xxx.length===4 && (adjacent: sortedArrayLast - sortedArrayFirst===24)
    //      ==>  WINNER!
    // ----- DIAGONAL UPHILL -----
    //    const xxx = set(...[arrayOfAllOrangeCellNums], ...[arrayOfItsDiagUpNumbers])
    //    if xxx.length===4 && (adjacent: sortedArrayLast - sortedArrayFirst===21)
    //      --- OR ---
    //    if xxx.length===5 && (adjacent: sortedArrayLast - sortedArrayFirst===28)
    //      ==>  WINNER!
    // ----- DIAGONAL DOWNHILL -----
    //    const xxx = set(...[arrayOfAllOrangeCellNums], ...[arrayOfItsDiagUpNumbers])
    //    if xxx.length===4 && (adjacent: sortedArrayLast - sortedArrayFirst===27)
    //      --- OR ---
    //    if xxx.length===5 && (adjacent: sortedArrayLast - sortedArrayFirst===36)
    //      ==>  WINNER!

// 4.1) If yes, declare winner and add score to tally

// 4.2) If no, move onto step 5



// 5) change colour of ball (ball = blue);
// ballColour === 'orange' ? 'blue' : 'orange';
// console.log(`Ball colour changed to ${ballColour}`) 

// 5.1) ---------- IF 1-PLAYER GAME ----------
     // Computer to generate a move: Get random column: Math.floor(Math.random()*8)
     // v2: test for any horizontal or vertical 3-in-a-rows: computer blocks it 
     // Move onto step 6

// 5.2) ---------- IF 2-PLAYER GAME ----------
     // Move onto step 6

// 6) run step (3) and (4)

newGameBtn.addEventListener('click', () => {
  // Once it can be clicked on (when there is a winner):
  winnerAnnounced.innerText = '';
  createOrResetGrid();
  cells = document.querySelectorAll('.cell');
  winner = null;
  gameStatus = null; 
  addEventListenersToEachCell();
})