class Game {
  constructor(grid) {
    this.grid = grid;
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
} 