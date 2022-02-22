# Project 1: Basketball Connect 4
The traditional Connect Four game with a basketball twist. (Link to live game when finished)

[image to go here]

## Tech Stack used:
- HTML, CSS and vanilla Javascript


## Game Features:
### MVP (v0):
- A working game of connect 4 (with correct logic to check for a win) in an 8x5 grid.
- The counters will be orange and blue basketballs.
- The balls going into the grid are animated to slide down the grid, rather than just appear in the correct cell.
- '2-player' mode and a '1-player v computer' mode. Computer will not be intelligent, will only be randomised moves.
- Scoring: multiple games within a tournament (game score & tournament score)
- Buttons: start new game, or start new tournament (scoreboard (tracks game wins) is only cleared after new tournament starts)

### Version 1 (v1) - the glitter on top v0:
- Animation of ball being shot (a perfect arc) from player images to the selected column of the grid.
- Hoop & backboard images above each column.
- Swish sound when each ball goes in each column.
- Grid background will be a basketball court on page load, then each cell will appear to fill out the grid.
- Either side of the grid will display player images (MJ/Kobe/Lebron) shooting. For the 1-player mode, one of the players will be a silhouette shooting
- Computer to make calculated moves rather than random ones

### V2:
- Users select which hoop they want to drop the ball down via clicking on the players
- The longer users hold down the click for, the further the ball shoots


## Approach Taken:
- Pseudocoded 90% the JS before beginning any coding (comments in app.js and excalidraw). The 10% with event listeners interacting were too complicated to picture without any code, so that part was figured out along the way
- Minimal HTML and CSS to begin with; prioritised JS
- Had a functioning version of the game in JS first before doing a whole codebase refactor into classes


## Unsolved problems:
- In the 2-player set up, if the mouse hover stays in the same cell as the one the previous turn clicked on, the ball doesn't appear at the top.