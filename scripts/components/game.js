class Game {
  constructor(grid) {
    this.grid = grid;
    this.currentScoreP1 = 0;
    this.currentScoreP2 = 0;
    // Bind this to the one CALLING an inner method:
    this.verifyPlaceCheck = this.verifyPlaceCheck.bind(this);  
    this.yPositionStart;
    this.slide;    
    this.winningCells;
  }

  createOrResetGrid() {
    this.grid.innerHTML = '';  // empty (reset) grid contents
    for (let i = 0; i < numOfCells; i++) {  // numOfCells=48
      let cellDiv = document.createElement('div');
      cellDiv.classList.add('cell');
      cellDiv.setAttribute('data-id', i);
      this.grid.appendChild(cellDiv);
    }
  }
  
  displayHoops() {
    let previousHoopPosition = 5;
    for (let i = 0; i < gridWidth; i++) {  // gridWidth=8
      let hoop = document.createElement('img');
      hoop.setAttribute('src', './images/hoop-black.png');
      hoop.setAttribute('alt', 'baskteball hoop');
      hoop.classList.add('hoop');
      hoop.setAttribute('id', `hoop-${i}`);
      grid.appendChild(hoop);
      if (i === 0) {
        document.querySelector(`#hoop-${i}`).style.left = `${previousHoopPosition}px`;
      } else {
        // Add 103 pixes to the 'left' attribute each time
        document.querySelector(`#hoop-${i}`).style.left = `${previousHoopPosition+=103}px`;
      }
    }
  }

  displayPlayerImages() {
    jordan.classList.remove('hide');
    if (modeSelected === '1player') {
      // show jordan & silhouette
      silhouette.classList.remove('hide');
    } else {  // show jordan and kobe
      kobe.classList.remove('hide');
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
    if (!winner && turn === 'player') {
      const colNum = event.target.getAttribute('data-id') % 8;
      document.querySelector(`div[data-id='${colNum}']`)
        .classList.add(`hovered-${ballColour}`);
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

  addHoverEventListener(arrayOfCells) {
    arrayOfCells.forEach((cell) => {
      cell.addEventListener('mouseover', this.ballAppearOnTop);
      cell.addEventListener('mouseleave', this.ballDisappearOnTop);
    })
  }
  
  removeHoverEventListener(arrayOfCells) {
    arrayOfCells.forEach((cell) => {
      cell.removeEventListener('mouseover', this.ballAppearOnTop);
      cell.removeEventListener('mouseleave', this.ballDisappearOnTop);
    })
  }

  addClickEventListener(arrayOfCells) {
    arrayOfCells.forEach((cell) => {
      cell.addEventListener('click', this.verifyPlaceCheck);
    })
  }

  removeClickEventListener(arrayOfCells) {
    arrayOfCells.forEach((cell) => {
      cell.removeEventListener('click', this.verifyPlaceCheck);
    })
  }
  
  playGame(cells) {
    if (turn === 'computer') {
      this.computerToMoveNext();
    }
    winner = null;
    gameStatus = null;  // 'ongoing' or 'ended';
    this.addEventListenersToEachCell(cells);
  }

  computerToMoveNext() {
    let colNum;
    if (turn === 'computer') {
      // scan whole grid for orange cells
      if (document.querySelectorAll('.filled').length >= 5) {
        const orangeElements = document.querySelectorAll('#orange');
        const orangeCells = [...orangeElements].map((element) => element.dataset.id);
        // BLOCK VERTICAL WINS:
        // loop through every col: if 3-in-a-row vertical:
        let entireColCells;
        let filteredOrangeColCells;
        for (let i = 0; i < gridWidth; i++) { 
          entireColCells = gridOverview.columns[`column${i}`].sort((a, b) => b - a);
          filteredOrangeColCells = entireColCells
            .filter((colCell) => orangeCells.includes(String(colCell)))
            .sort((a, b) => a - b);
          let last = filteredOrangeColCells[filteredOrangeColCells.length-1];
          let first = filteredOrangeColCells[0];
          // check is cell directly above 3-in-a-row is filled
          let cellAboveThree = document.querySelector(`div[data-id='${first-8}']`);
          // if 3-in-a-row oranges && cell above top one is in grid && empty:
          if (filteredOrangeColCells.length > 2 && last - first === 16 && first - 8 > 7 
            && !cellAboveThree.classList.contains('filled')) {
            colNum = i;
          }
        }
        // BLOCK some HORIZONTAL WINS:
        if (!colNum) {
          let entireRowCells;
          let filteredOrangeRowCells;
          for (let i = 0; i < gridHeight; i++) { 
            entireRowCells = gridOverview.rows[`row${i}`].sort((a, b) => b - a);
            filteredOrangeRowCells = entireRowCells
              .filter((rowCell) => orangeCells.includes(String(rowCell)))
              .sort((a, b) => a - b);
            let differences = [];
            for (let i = 0; i < filteredOrangeRowCells.length - 1; i++) {
              differences.push(filteredOrangeRowCells[i + 1] - filteredOrangeRowCells[i]);
            }
            // Match consecutive 1s precisely 2 or more times:
            const regex = /1{2,}/g;
            if (differences.join('').match(regex) >= 1) {
              // get array of the string of differences split by 2 consecutive ones:
              const tmp = differences.join('').split(regex);
              let consecutiveCells;
              if (typeof (tmp) === 'object' && tmp.length >= 2) {
                // 3-in-a-row
                if ((tmp[0] === '' && tmp[1] === '') || tmp[0] === '') {
                  consecutiveCells = filteredOrangeRowCells.slice(0, 3);
                } else if (tmp[1] == '') {  // 4-in-a-row = last 4
                  consecutiveCells = filteredOrangeRowCells.slice(-3);
                }
              }
              if (consecutiveCells) {
                let first = consecutiveCells[0];
                let last = consecutiveCells[2];
                // check if directly left is a free cell to block:
                let leftCell = document.querySelector(`div[data-id='${first - 1}']`);
                let rightCell = document.querySelector(`div[data-id='${last + 1}']`);
                if ((first - 1) % 8 <= 4 && !leftCell.classList.contains('filled')) {
                  colNum = (first - 1) % 8;
                  // check if directly right is a free cell to block:
                } else if ((last + 1) % 8 >= 3 && !rightCell.classList.contains('filled')) {
                  colNum = (last + 1) % 8;
                }
              }
            }
          }
        }
        if (!(colNum || colNum === 0)) {  // `!colNum` won't work since could be zero
          colNum = Math.floor(Math.random() * 8);
        }
      } else {  // random move if board has <6 cells filled
        colNum = Math.floor(Math.random() * 8);
      }
      let firstAvailableCell = this.verify(colNum);
      if (firstAvailableCell) {
        this.slideAndplace(colNum, firstAvailableCell);
      }
    }
  } 

  verify(columnNumber) {
    // This modifies original gridOverview
    const colContents = gridOverview.columns[`column${columnNumber}`].sort((a, b) => b - a);  
    // Get first available cell in that column:
    let firstAvailableCell = colContents.find((cell) => {
      return !document.querySelector(`div[data-id='${cell}']`).classList.contains('filled');
    })

    if (!firstAvailableCell) {
      console.log('column FULL!');
      this.computerToMoveNext(); 
    } else {
      return columnNumber, firstAvailableCell;
    }
  }

  verifyPlaceCheck(event) {
    if (!winner && gameStatus !== 'ended') {  // 'null' or 'ongoing'
      let colNum = event.target.getAttribute('data-id') % 8;
      let firstAvailableCell = this.verify(colNum);
      if (firstAvailableCell) {
        this.removeClickEventListener(cells);
        // swishAudio.play();
        this.slideAndplace(colNum, firstAvailableCell);
        this.computerToMoveNext();
      }
    }
  }

  slideBall = (columnNumber, cellToFill, yPositionEnd, looseBall, firstAvailableCell) => {
    document.querySelector(`div[data-id='${columnNumber}']`).classList.remove(`hovered-orange`);
    document.querySelector(`div[data-id='${columnNumber}']`).classList.remove(`hovered-blue`);

    this.removeHoverEventListener(cells);
    this.yPositionStart += 4;
    
    looseBall.style.top = `${this.yPositionStart + 1}px`;

    if (this.yPositionStart > yPositionEnd) {
      clearInterval(this.slide);
      cellToFill.classList.add('filled');
      cellToFill.setAttribute('id', ballColour); 
      looseBall.classList.add('hide');
      this.checkForAWin(columnNumber, firstAvailableCell);
      this.checkGameStatus();
      this.computerToMoveNext();
      this.addHoverEventListener(cells);
    }
  }

  slideAndplace(columnNumber, firstAvailableCell) {
    // remove this here again when it's the computer's turn:
    this.removeClickEventListener(cells);
    let cellToFill = document.querySelector(`div[data-id='${firstAvailableCell}']`);
    
    // Get position of ball-start (top hidden row cell)
    let startingCell = document.querySelector(`div[data-id='${columnNumber}']`)
    let xPositionStart = startingCell.getBoundingClientRect().left  // same as end
    this.yPositionStart = startingCell.getBoundingClientRect().top
    let yPositionEnd = cellToFill.getBoundingClientRect().top

    let looseBall = ballColour === 'orange' ? looseBallOrange : looseBallBlue;
    looseBall.classList.remove('hide');
    looseBall.style.top = `${this.yPositionStart + 1}px`;
    looseBall.style.left = `${xPositionStart + 9}px`;

    this.cTF = cellToFill;
    this.cN = columnNumber;
    this.yE = yPositionEnd;
    this.lB = looseBall;
    this.fAC = firstAvailableCell;
    this.slide = setInterval(() => this.slideBall(this.cN, this.cTF, this.yE, this.lB, this.fAC), 1)    
  }

  checkGameStatus() {
    if (winner || gameStatus === 'ended') {
      gameStatus = 'ended';
      newGameBtn.disabled = false;
      newTournaBtn.disabled = false;
      turn = modeSelected === '2player' ? 'player' : null;
      this.updateScore();  // does nothing if winner = null
      newGameBtn.classList.add('flash');
      newTournaBtn.classList.add('flash');
      ifNewGameClickAllowed();
    } else {
      gameStatus = 'ongoing';
      newGameBtn.disabled = true;
    }
  }

  updateScore() {
    if (winner === 'orange' && !scoreUpdated) {
      this.currentScoreP1++;
      scoreUpdated = true;
      player1Score.innerText = this.currentScoreP1;
    } else if (winner === 'blue' && !scoreUpdated) {
      this.currentScoreP2++;
      scoreUpdated = true;
      player2Score.innerText = this.currentScoreP2;
    }
  }

  crossReferenceCells(direction, directionCells, currentPlayerCells) {
  let theWinningCells;
  let filteredCells;
  if (direction === 'horizontal') {
    filteredCells = directionCells
      .filter((rowCell) => currentPlayerCells.includes(String(rowCell)))
      .sort((a, b) => a - b);
    let differences = [];
    for (let i = 0; i < filteredCells.length - 1; i++) {
      differences.push(filteredCells[i + 1] - filteredCells[i]);
    }
    // Match consecutive 1s precisely 3 or more times:
    const regex = /1{3,}/g;
    if (differences.join('').match(regex) >= 1) {
      this.getWinnerDeclaration()
      winner = ballColour;
      // get winning cells:
      /// get array of the string of differences split by 3+ consecutive ones:
      const tmp = differences.join('').split(regex);
      // if '111'+ exists, array will be of length 2 (grid is only 8 long, so can't 
      // be >2 here, but theoretically yes). if not found, could be -1.        
      if (typeof (tmp) === 'object' && tmp.length === 2) { // winner
        // 4-in-a-row = first 4 or first 7
        if ((tmp[0] === '' && tmp[1] === '') || tmp[0] === '') {
          theWinningCells = filteredCells.slice(0, 4);
        } else if (tmp[1] == '') {  // 4-in-a-row = last 4
          theWinningCells = filteredCells.slice(-4);
        } else {  // 4-in-a-row: middle 4
          theWinningCells = filteredCells.slice(1, filteredCells.length - 1);
        }
      }
    }
  } else {  // vertical, diagUp or diagDown:
    let winningCondition;
    switch (direction) {
      case 'vertical':
        if (!winner) {
          // vertical check:  // will always have column contents
          filteredCells = directionCells
            .filter((colCell) => currentPlayerCells.includes(String(colCell)))
            .sort((a, b) => a - b);
          winningCondition = (filteredCells.length === 4 
            && filteredCells[filteredCells.length - 1] - filteredCells[0] === 24);
        }
        break;
      case 'diagUp':
        if (!winner && directionCells) {
          filteredCells = directionCells
            .filter((diagUpCell) => currentPlayerCells.includes(String(diagUpCell)))
            .sort((a, b) => a - b);
          winningCondition = ((filteredCells.length === 4 
            && filteredCells[filteredCells.length - 1] - filteredCells[0] === 21) 
            || (filteredCells.length === 5 
              && filteredCells[filteredCells.length - 1] - filteredCells[0] === 28));
        }
        break;
      case 'diagDown':
        if (!winner && directionCells) {
          filteredCells = directionCells
            .filter((diagDownCell) => currentPlayerCells.includes(String(diagDownCell)))
            .sort((a, b) => a - b);
          winningCondition = ((filteredCells.length === 4 
            && filteredCells[filteredCells.length - 1] - filteredCells[0] === 27) 
            || (filteredCells.length === 5 
              && filteredCells[filteredCells.length - 1] - filteredCells[0] === 36));
        }
        break;
      default:
        console.log('direction invalid');
    }
    if (winningCondition) {
      this.getWinnerDeclaration()
      winner = ballColour;
      theWinningCells = filteredCells.slice(0, 4);
    }
  }
  if (theWinningCells) {
    return theWinningCells;
  }
}

  checkForAWin(columnNumber, firstAvailableCell) {

    if (document.querySelectorAll('.filled').length > 6) {
      const lastPlayedCell = firstAvailableCell;
      const rowNum = Math.floor(lastPlayedCell / 8) - 1;
      const diagUpNum = (lastPlayedCell - 11) % 7;
      const diagDownNum = (lastPlayedCell - 7) % 9;
      
      const colCells = gridOverview.columns[`column${columnNumber}`];
      const rowCells = gridOverview.rows[`row${rowNum}`];
      let diagUpCells = ((diagUpNum >= 0 && diagUpNum < 6) 
        ? gridOverview.diagonalUphill[`diagUp${diagUpNum}`] 
        : null);
      // safety check: since (16-11)%7=5, but should be null
      // (this is not a problem for diagDown)
      if (diagUpCells && !diagUpCells.includes(lastPlayedCell)) {
        diagUpCells = null;
      }
      const diagDownCells = ((diagDownNum >= 0 && diagDownNum < 6) 
        ? gridOverview.diagonalDownhill[`diagDown${diagDownNum}`] 
        : null);
      
      // Get all cell numbers that have ballColour ids:
      const playerXElements = document.querySelectorAll(`#${ballColour}`);
      // To map over nodelist: first convert to array:
      const playerXCells = [...playerXElements].map((element) => element.dataset.id);
      this.winningCells = this.crossReferenceCells('horizontal', rowCells, playerXCells);
      if (!this.winningCells) {
        this.winningCells = this.crossReferenceCells('vertical', colCells, playerXCells);
      }
      if (!this.winningCells) {
        this.winningCells = this.crossReferenceCells('diagUp', diagUpCells, playerXCells);
      }
      if (!this.winningCells) {
        this.winningCells = this.crossReferenceCells('diagDown', diagDownCells, playerXCells);
      }

      // after clicked, make hovered ball (top row) disappear:
      document.querySelector(`div[data-id='${columnNumber}']`).classList.remove(`hovered-orange`);
      document.querySelector(`div[data-id='${columnNumber}']`).classList.remove(`hovered-blue`);
    }

    this.switchTurnOrEndGame();
  }
  
  getWinnerDeclaration() {
    if (modeSelected === '1player') {
      winnerAnnounced.innerText = 
        `${ballColour === 'orange' ? 'You are' : 'Your mysterious opponent is'} the WINNER!!!`;
    } else {
      winnerAnnounced.innerText = 
        `${ballColour === 'orange' ? 'Player 1' : 'Player 2'} is the WINNER!!!`;
    }
  }

  switchTurnOrEndGame() {
    let totalCellsFilled = document.querySelectorAll('.filled').length;
    // if no winner and board not filled:
    if (!winner && totalCellsFilled < 40) {
      ballColour = ballColour === 'orange' ? 'blue' : 'orange';
      this.addClickEventListener(cells)
      if (modeSelected === '1player') {
        turn = turn === 'player' ? 'computer' : 'player';
      }
    } else if (winner) {  // if there IS a winner, make the ball orange for the next game:
      gameStatus = 'ended';
      ballColour = 'orange';
      // Pulsate the winning 4 cells!:
      this.winningCells.forEach((winningCell) => {
        document.querySelector(`div[data-id='${winningCell}']`).classList.add('pulsate')
      })
    } else if (totalCellsFilled === 40) {
      winnerAnnounced.innerText = `It's a draw!`;
      gameStatus = 'ended';
    }
  }

}