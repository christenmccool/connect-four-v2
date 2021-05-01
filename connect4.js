/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])
let player1Color;
let player2Color;


/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // set "board" to empty HEIGHT x WIDTH matrix array
  for (let y = 0; y < HEIGHT; y++) {
    board[y] = [];
    for (let x = 0; x < WIDTH; x++) {
      board[y].push(null);
    }
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // Get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.querySelector("#board");
  htmlBoard.innerHTML = '';

  // Create first row of the gameboard where players click to select next move
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // Create gameboard with HEIGHT rows 
  // Each row contains WIDTH td elements
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);

      const cellHole = document.createElement('div');
      cellHole.classList.add(`cell-hole`);
      cell.append(cellHole);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  let col = board.map(row => row[x]);
  let firstFull = col.findIndex(cell => cell===1 || cell===2);
  if (firstFull === -1) return HEIGHT - 1;
  if (firstFull === 0) return null;
  return firstFull - 1;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // Makes a div and insert into correct table cell
  const piece = document.createElement("div");
  piece.classList.add('piece');
  if (currPlayer === 1) {
    piece.style.backgroundColor = player1Color;
  } else {
    piece.style.backgroundColor = player2Color;
  }
  // const cell = document.querySelector(`#${y}-${x}`);
  const cell = document.getElementById(`${y}-${x}`);
  cell.append(piece);
}

/** endGame: announce game end */

function endGame(msg) {
  setTimeout(() => {
    const board = document.getElementById('board');
    const winText = document.createElement('div');
    winText.setAttribute('id', 'winner');
    winText.innerText = msg;
    if (currPlayer === 1) {
      winText.style.backgroundColor = player1Color;
    } else {
      winText.style.backgroundColor = player2Color;
    }
    board.append(winText);
  }, 1000);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // if all cells in board are filled; if so call, call endGame
  if (board.every(row => row.every(cell => cell===1 || cell===2))) {
    return endGame(`It was a tie!`);
  }

  // switch currPlayer 1 <-> 2
  currPlayer = currPlayer===1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // get player for each cell in groups of 4 consecutive pieces
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

startBtn = document.querySelector('form');
startBtn.addEventListener('submit', (evt) => {
  evt.preventDefault();
  currPlayer = 1; 
  board = [];   

  player1Color = document.querySelector('#player1').value;
  player2Color = document.querySelector('#player2').value;

  makeBoard();
  makeHtmlBoard();  
})
