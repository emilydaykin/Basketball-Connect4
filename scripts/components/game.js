class Game {
  constructor(grid, modeSelected, ballColour, winner, gameStatus, turn, currentScoreP1, currentScoreP2, scoreUpdated) {
    this.grid = grid;
    this.gameStatus = gameStatus;
    this.winner = winner;
    this.verifyPlaceCheck = this.verifyPlaceCheck.bind(this);  // bind it to the one CALLING an inner method
    // this.verify = this.verify.bind(this);
    // this.slideAndplace = this.slideAndplace.bind(this);
    // this.checkForAWin = this.checkForAWin.bind(this);
    // this.slideAndplace.slideBall = this.slideAndplace.slideBall.bind(this);
    // this.slide = this.slide.bind(this);
    this.slideBall = this.slideBall.bind(this);
    // var self = this;
    // this.slideBall.bind(this)
    var self = this;
    self.slideBall = self.slideBall.bind(self);

    
    // verifyPlaceCheck
    
  }

  createOrResetGrid() {
    this.grid.innerHTML = '';  // empty (reset) grid contents
    for (let i = 0; i < numOfCells; i++) {
      let cellDiv = document.createElement('div');
      cellDiv.classList.add('cell');
      cellDiv.setAttribute('data-id', i);
      this.grid.appendChild(cellDiv);
    }
  }

  initialiseScoreboard(player1, player2) {
    player1Name.innerHTML = `${player1} &nbsp;`;
    player2Name.innerHTML = `&nbsp; ${player2}`;
    player1Score.innerText = 0;
    scoreDivider.innerHTML = '&nbsp; &mdash; &nbsp;';
    player2Score.innerText = 0;
  }

  ballAppearOnTop(event) {
    if (!this.winner && turn === 'player') {
      const colNum = event.target.getAttribute('data-id') % 8;
      document.querySelector(`div[data-id='${colNum}']`).classList.add(`hovered-${ballColour}`)
    }
  }
  
  ballDisappearOnTop(event) {
  const colNum = event.target.getAttribute('data-id') % 8;
  document.querySelector(`div[data-id='${colNum}']`).classList.remove(`hovered-orange`);
  document.querySelector(`div[data-id='${colNum}']`).classList.remove(`hovered-blue`);
}

  addEventListenersToEachCell(arrayOfCells) {
    arrayOfCells.forEach((cell) => {
      cell.addEventListener('mouseover', this.ballAppearOnTop);
      cell.addEventListener('mouseleave', this.ballDisappearOnTop);
      cell.addEventListener('click', this.verifyPlaceCheck);
    });
  }

  playGame(cells) {
    console.log("TURNNNNNNN:", turn);
    console.log("BAAALLLLL COLOUR:", ballColour);
    if (turn === 'computer') {
      this.computerToMoveNext();
    }
    this.winner = null;
    this.gameStatus = null;  // 'ongoing' or 'ended';
    this.addEventListenersToEachCell(cells);
  }

  computerToMoveNext() {
    console.log('TURN INSIDE CTMX function:', turn);
    if (turn === 'computer') {
      // Randomised choice
      colNum = Math.floor(Math.random() * 8);
      // Smart choice:
      // -- to be implemented later --
      // verifyPlaceCheckMANPOWER(colNum);
      let firstAvailableCell = this.verify(colNum);
      if (firstAvailableCell) {
        slideAndplace(colNum, firstAvailableCell);
      }
    }
  } 

  verify(columnNumber) {
    // var self = this;
    const colContents = gridOverview.columns[`column${columnNumber}`].sort((a, b) => b - a);  // modifies original gridOverview

    // Get first available cell in that column:
    let firstAvailableCell = colContents.find((cell) => {
      return !document.querySelector(`div[data-id='${cell}']`).classList.contains('filled');
    })

    if (!firstAvailableCell) {
      console.log('column FULL!');
      this.computerToMoveNext();  // get the computer to choose another col
    } else {
      return columnNumber, firstAvailableCell;
    }
  }

  verifyPlaceCheck(event) {
    if (this.gameStatus !== 'ended') {  // 'null' or 'ongoing'
      if (!this.winner) {
        let colNum = event.target.getAttribute('data-id') % 8;
        let firstAvailableCell = this.verify(colNum);
        if (firstAvailableCell) {
          this.slideAndplace(colNum, firstAvailableCell);
          this.computerToMoveNext();
        }
      }
    }
    console.log('GAME-STATUS:', gameStatus)
  }

  slideBall(columnNumber, yPositionStart, yPositionEnd, looseBall) {
    document.querySelector(`div[data-id='${columnNumber}']`).classList.remove(`hovered-orange`);
    document.querySelector(`div[data-id='${columnNumber}']`).classList.remove(`hovered-blue`);
    cells.forEach((cell) => {
      cell.removeEventListener('mouseover', this.ballAppearOnTop);
      cell.removeEventListener('mouseleave', this.ballDisappearOnTop);
    });

    console.log('yPositionStart BEFORE', yPositionStart)
    yPositionStart += 4;
    console.log('yPositionStart AFTER', yPositionStart)
    looseBall.style.top = `${yPositionStart + 1}px`;
    
    // console.log('------- working up till here')
    
    // 50 because ~0.5*cellHeight, so that the 'animation' is smooth at the end
    if (yPositionStart > yPositionEnd + 50) {
      console.log('------- working up till here')
      clearInterval(this.slide);
      cellToFill.classList.add('filled');
      console.log('ball colour to fill:', ballColour);
      // ballColourTmp = ballColour === 'orange' ? 'blue' : 'orange';
      cellToFill.setAttribute('id', ballColour); // VERY hacky fix - terrible - also breaks the win logic;
      // ^ above two lines are due to the ball colour changing before it gets placed from set interval
      looseBall.classList.add('hide');
      // cellToFill.classList.add('ball-drop-animation');
      this.checkForAWin(columnNumber, firstAvailableCell);
      this.checkGameStatus();
      this.computerToMoveNext();

      cells.forEach((cell) => {
        cell.addEventListener('mouseover', ballAppearOnTop);
        cell.addEventListener('mouseleave', ballDisappearOnTop);
      })
    }
  }

  slideAndplace(columnNumber, firstAvailableCell) {
    console.log('firstAvailableCell:', firstAvailableCell);
    let cellToFill = document.querySelector(`div[data-id='${firstAvailableCell}']`);

    // Get position of ball-start (top hidden row cell)
    let startingCell = document.querySelector(`div[data-id='${columnNumber}']`)
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

    
    // this.slideBall = (columnNumber, yPositionStart, yPositionEnd, looseBall) => {
    //   document.querySelector(`div[data-id='${columnNumber}']`).classList.remove(`hovered-orange`);
    //   document.querySelector(`div[data-id='${columnNumber}']`).classList.remove(`hovered-blue`);
    //   cells.forEach((cell) => {
    //     cell.removeEventListener('mouseover', this.ballAppearOnTop);
    //     cell.removeEventListener('mouseleave', this.ballDisappearOnTop);
    //   });

    //   console.log('yPositionStart BEFORE', yPositionStart)
    //   yPositionStart += 4;
    //   console.log('yPositionStart AFTER', yPositionStart)
    //   looseBall.style.top = `${yPositionStart + 1}px`;

    //   // console.log('------- working up till here')

    //   // 50 because ~0.5*cellHeight, so that the 'animation' is smooth at the end
    //   if (yPositionStart > yPositionEnd + 70) {
    //     console.log('------- working up till here')
    //     clearInterval(slide);
    //     cellToFill.classList.add('filled');
    //     console.log('ball colour to fill:', ballColour);
    //     // ballColourTmp = ballColour === 'orange' ? 'blue' : 'orange';
    //     cellToFill.setAttribute('id', ballColour); // VERY hacky fix - terrible - also breaks the win logic;
    //     // ^ above two lines are due to the ball colour changing before it gets placed from set interval
    //     looseBall.classList.add('hide');
    //     // cellToFill.classList.add('ball-drop-animation');
    //     this.checkForAWin(columnNumber, firstAvailableCell);
    //     this.checkGameStatus();
    //     this.computerToMoveNext();

    //     cells.forEach((cell) => {
    //       cell.addEventListener('mouseover', ballAppearOnTop);
    //       cell.addEventListener('mouseleave', ballDisappearOnTop);
    //     })
    //   }
    // }
    var self = this;
    this.slide = setInterval(self.slideBall(columnNumber, yPositionStart, yPositionEnd, looseBall), 1);
    
  }

  checkGameStatus() {
    console.log('CHECK GAME STATUS CALLED')
    if (this.winner || this.gameStatus === 'ended') {
      gameStatus = 'ended';
      newGameBtn.disabled = false;
      newTournaBtn.disabled = false;
      console.log('WE HAVE A WINNER');
      turn = modeSelected === '2player' ? 'player' : null;
      console.log('===== Updating score...')
      this.updateScore();  // does nothing if winner = null
      ifNewGameClick();
    } else {
      gameStatus = 'ongoing';
      console.log('no winner yet....');
      newGameBtn.disabled = true;
      // change computer to player???
    }
}

updateScore() {
  if (this.winner === 'orange' && !this.scoreUpdated) {
    this.currentScoreP1++;
    this.scoreUpdated = true;
    console.log(`Score is now ${currentScoreP1} for player 1!`)
    this.player1Score.innerText = currentScoreP1;
  } else if (this.winner === 'blue' && !scoreUpdated) {
    this.currentScoreP2++;
    this.scoreUpdated = true;
    console.log(`Score is now ${currentScoreP2} for player 2!`)
    this.player2Score.innerText = this.currentScoreP2;
  }
}

checkForAWin(columnNumber, firstAvailableCell) {

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
  const playerXCells = Array.from(playerXElements).map((element) => element.dataset.id);
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
    winnerAnnounced.innerText = `${ballColour} is the WINNER!!! (horizontal)`;
    this.winner = this.ballColour;
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
  if (!this.winner) {
    // vertical check:  // will always have column contents
    console.log('orangeCells:', playerXCells, 'col cells:', colCells)
    xxx = colCells.filter((colCell) => playerXCells.includes(String(colCell))).sort((a, b) => a - b);
    console.log('xxx', xxx);
    if (xxx.length === 4 && xxx[xxx.length - 1] - xxx[0] === 24) {
      console.log(`${ballColour} is the WINNER!!! (vertical)`);
      winnerAnnounced.innerText = `${ballColour} is the WINNER!!! (vertical)`;
      this.winner = ballColour;
      winningCells = xxx.slice(0, 4);
      console.log('winningCells', winningCells);
    }
  }
  // might not have a corresponding updiag if < 4
  if (!this.winner && diagUpCells) {
    console.log('orangeCells:', playerXCells, 'diagUp cells:', diagUpCells)
    xxx = diagUpCells.filter((diagUpCell) => playerXCells.includes(String(diagUpCell))).sort((a, b) => a - b);
    console.log('xxx', xxx);
    if ((xxx.length === 4 && xxx[xxx.length - 1] - xxx[0] === 21) || (xxx.length === 5 && xxx[xxx.length - 1] - xxx[0] === 28)) {
      console.log(`${ballColour} is the WINNER!!! (diagUp)`);
      winnerAnnounced.innerText = `${ballColour} is the WINNER!!! (diagUp)`;
      this.winner = ballColour;
      winningCells = xxx.slice(0, 4);
      console.log('winningCells', winningCells);
    }
  }
  // might not have a corresponding downdiag if < 4
  if (!this.winner && diagDownCells) {
    console.log('orangeCells:', playerXCells, 'diagDown cells:', diagDownCells)
    xxx = diagDownCells.filter((diagDownCell) => playerXCells.includes(String(diagDownCell))).sort((a, b) => a - b);
    console.log('xxx', xxx);
    if ((xxx.length === 4 && xxx[xxx.length - 1] - xxx[0] === 27) || (xxx.length === 5 && xxx[xxx.length - 1] - xxx[0] === 36)) {
      console.log(`${ballColour} is the WINNER!!! (diagDown)`);
      winnerAnnounced.innerText = `${ballColour} is the WINNER!!! (diagDown)`;
      this.winner = ballColour;
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
  if (!this.winner && totalCellsFilled < 40) {
    ballColour = ballColour === 'orange' ? 'blue' : 'orange';
    console.log(`ballColour now changed to ${ballColour.toUpperCase()} for next turn`);
    console.log('MODE SELECTED', modeSelected);
    if (modeSelected === '1player') {
      console.log('TURN WAS:', turn);
      turn = turn === 'player' ? 'computer' : 'player';
      console.log('TURN IS NOW:', turn);
    }
  } else if (this.winner) {  // if there IS a winner, make the ball orange for the next game:
    this.gameStatus = 'ended';
    this.ballColour = 'orange';
    // Pulsate the winning 4 cells!:
    winningCells.forEach((winningCell) => {
      document.querySelector(`div[data-id='${winningCell}']`).classList.add('pulsate')
    })
  } else if (totalCellsFilled === 40) {
    console.log("It's a draw!");
    winnerAnnounced.innerText = `It's a draw!`;
    this.gameStatus = 'ended';
  }
}





}