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