// ------------------------------------------------------------------ //
// ---------------------  Basketball Connect 4  --------------------- //
// ------------------------------------------------------------------ //

// 0) Create a (flex) grid
  // gridWidth = 8;
  // gridHeight = 5;
  // vertical = gridWidth;   // +-8
  // horizontal = 1;
  // diagUp = gridWidth - 1;  // +-7
  // diagDown = gridWidth + 1 // +-9
  // // 8*6 (extra row at the top for ball to hover)
  // grid = gridWidth * (gridHeight + 1)

// 1) Show the grid

// 1.25) Create an overview of the grid
// this should probably be written programmatically 
  // const gridOverview = {
  //   columns: {
  //     // column number = cellNum % 8
  //     column0: [8, 16, 24, 32, 40],  // left-most col
  //     column1: [9, 17, 25, 33, 41],
  //     column2: [10, 18, 26, 34, 42],
  //     column3: [11, 19, 27, 35, 43],
  //     column4: [12, 20, 28, 36, 44],
  //     column5: [13, 21, 29, 37, 45],
  //     column6: [14, 22, 30, 38, 46],
  //     column7: [15, 23, 31, 39, 47],  // right-most col
  //   },
  //   rows: {
  //     // row num = Math.floor(cellNum / 8) - 1
  //     row0: [8, 9, 10, 11, 12, 13, 14, 15],  // top row
  //     row1: [16, 17, 18, 19, 20, 21, 22, 23],
  //     row2: [24, 25, 26, 27, 28, 29, 30, 31],
  //     row3: [32, 33, 34, 35, 36, 37, 38, 39],
  //     row4: [40, 41, 42, 43, 44, 45, 46, 47],  // bottom row
  //   },
  //   diagonalUphill: {  // y=x
  //     // diagnum = (cellNum-11) % 7
  //     diagUp0: [11, 18, 25, 32],  // first one from left with >=4
  //     diagUp1: [12, 19, 26, 33, 40],
  //     diagUp2: [13, 20, 27, 34, 41],
  //     diagUp3: [14, 21, 28, 35, 42],
  //     diagUp4: [15, 22, 29, 36, 43],
  //     diagUp5: [23, 30, 37, 44],
  //   },
  //   diagonalDownhill: {  // y=-x
  //     // diagnum = (cellNum-7) % 9
  //     diagDown0: [16, 25, 34, 43],  // first one from left with >=4
  //     diagDown1: [8, 17, 26, 35, 44],
  //     diagDown2: [9, 18, 27, 36, 45],
  //     diagDown3: [10, 19, 28, 37, 46],
  //     diagDown4: [11, 20, 29, 38, 47],
  //     diagDown5: [12, 21, 30, 39],
  //   }
  // }
  
  // 1.5) Add event listeners to HTML buttons (1-player mode or 2-player mode)
  //       --- User (orange) always goes first ---
  //       If 2-player mode clicked, PLAY ENTIRE GAME (steps 2-6)
  //       If 1-player mode clicked, PLAY ENTIRE GAME (steps 2-6) with computer generated moves
  
  // 1.75) Declare ball = orange (will switch to blue for other player)


// 2) Add an event listener to each column of the grid - console log 
//    the column of grid clicked on. 
    // cellNum % 8 === 0 ==> col 0
    // ? Will the event listener will be on entire grid (and event.target
    // ? will give cell number)? Or have the event listener on each cell?
    // ? hmm probs latter...
    // Wrap each entire turn inside event listener (steps 3 & 4)

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

// 5.1) ---------- IF 1-PLAYER GAME ----------
     // Computer to generate a move: Get random column: Math.floor(Math.random()*8)
     // v2: test for any horizontal or vertical 3-in-a-rows: computer blocks it 
     // Move onto step 6

// 5.2) ---------- IF 2-PLAYER GAME ----------
     // Move onto step 6

// 6) run step (3) and (4)