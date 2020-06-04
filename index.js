function createBoard(rowsCols) {
  const board = [];

  for (let i = 1; i <= rowsCols; i++) {
    let row = '.';
    row = row.repeat(rowsCols);
    board.push(row);
  }

  return board;
}

function canPlace(board, row, col) {
  //check row
  for (let i = 0; i < board.length; i++) {
    if (board[i][col] === 'Q') return false;
  }
  //check col
  for (let i = 0; i < board.length; i++) {
    if (board[row][i] === 'Q') return false;
  }
  //check diag
  for (let i = row, j = col; i < board.length && j < board.length; i++, j++) {
    if (board[i][j] === 'Q') return false;
  }
  //check diag
  for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
    if (board[i][j] === 'Q') return false;
  }
  //check diag
  for (let i = row, j = col; i < board.length && j >= 0; i++, j--) {
    if (board[i][j] === 'Q') return false;
  }
  //check diag
  for (let i = row, j = col; i >= 0 && j < board.length; i--, j++) {
    if (board[i][j] === 'Q') return false;
  }

  return true;
}

function place(board, row, col, val, table) {
  const newRow = board[row].split('');
  newRow[col] = val;
  board[row] = newRow.join('');
}

function solver(board, row, col, steps, solutions) {
  if (col === board.length) {
    steps.push([...board]);
    solutions.push([...board]);
    steps.push('DONE');
    return;
  }
  steps.push([...board]);

  for (let i = 0; i < board.length; i++) {
    if (canPlace(board, i, col)) {
      place(board, i, col, 'Q');
      solver(board, row, col + 1, steps, solutions);
      place(board, i, col, '.');
      steps.push([...board]);
    }
  }
}

function nQueens(n, type = 'solutions') {
  const steps = [];
  const solutions = [];
  const board = createBoard(n);

  solver(board, 0, 0, steps, solutions);

  if (type === 'steps') return steps;
  else return solutions;
}

const allSolutions = {
  '1': nQueens(1, 'solutions'),
  '2': nQueens(2, 'solutions'),
  '3': nQueens(3, 'solutions'),
  '4': nQueens(4, 'solutions'),
  '5': nQueens(5, 'solutions'),
  '6': nQueens(6, 'solutions'),
  '7': nQueens(7, 'solutions'),
  '8': nQueens(8, 'solutions'),
};

const allSteps = {
  '1': nQueens(1, 'steps'),
  '2': nQueens(2, 'steps'),
  '3': nQueens(3, 'steps'),
  '4': nQueens(4, 'steps'),
  '5': nQueens(5, 'steps'),
  '6': nQueens(6, 'steps'),
  '7': nQueens(7, 'steps'),
  '8': nQueens(8, 'steps'),
};

const startButton = document.getElementById('start');
const selection = document.getElementById('selection');
let tablesContainer = document.getElementById('tables-container');
let listOfTables = tablesContainer.childNodes;
const stopButton = document.getElementById('stop');
const solutionButton = document.getElementById('solutions-button');
const speedLabel = document.getElementById('speed-label');
const sizeLabel = document.getElementById('size-label');
const speedSlider = document.getElementById('speed');

const possibleSolutions = document.getElementsByClassName(
  'solution-title-left'
)[0];

const foundSolutions = document.getElementsByClassName(
  'solution-title-right'
)[0];

const defaultTable = document.createElement('div');
defaultTable.classList = 'new-table';
for (let i = 0; i < 8; i++) {
  const row = document.createElement('div');
  row.className = 'row';

  for (let j = 0; j < 8; j++) {
    const col = document.createElement('div');
    if (i % 2 === 0) {
      if (j % 2 === 0) col.className = 'col checkered-white';
      else col.className = 'col checkered-black';
    } else {
      if (j % 2 === 0) col.className = 'col checkered-black';
      else col.className = 'col checkered-white';
    }

    row.appendChild(col);
  }
  defaultTable.appendChild(row);
}

tablesContainer.appendChild(defaultTable);

function addBoard(board) {
  const newTable = document.createElement('div');
  newTable.classList = 'solution-table';
  for (let i = 0; i < board.length; i++) {
    const row = document.createElement('div');
    row.className = 'row';

    for (let j = 0; j < board.length; j++) {
      const col = document.createElement('div');
      col.className = 'col';

      if (i % 2 === 0) {
        if (j % 2 === 0) col.className = 'col checkered-white';
        else col.className = 'col checkered-black';
      } else {
        if (j % 2 === 0) col.className = 'col checkered-black';
        else col.className = 'col checkered-white';
      }

      if (board[i][j] === 'Q') {
        const queen = document.createElement('img');
        queen.src = 'queen-white.png';
        queen.className = 'queen';
        col.appendChild(queen);
      }
      row.appendChild(col);
    }
    newTable.appendChild(row);
  }
  const currentContainer = document.getElementById('solutions');

  currentContainer.appendChild(newTable);
}

const speed = document.getElementById('speed');
let time = 100;

speed.addEventListener('input', (e) => {
  const val = Number(e.target.value);

  if (val === 1) time = 1000;
  else if (val === 2) time = 500;
  else if (val === 3) time = 100;
  else if (val === 4) time = 25;
  else if (val === 5) time = 1;
});

let interval;

startButton.addEventListener('click', () => {
  const solutions = allSteps[selection.value];
  startButton.disabled = true;
  stopButton.disabled = false;
  speed.disabled = true;
  selection.disabled = true;
  let i = 1;

  const newSolutionContainer = document.createElement('div');
  newSolutionContainer.id = 'solutions';
  foundSolutions.innerHTML = '0 solutions found';

  const solContainerDiv = document.getElementsByClassName(
    'solutions-container'
  )[0];
  const currentContainer = document.getElementById('solutions');
  solContainerDiv.replaceChild(newSolutionContainer, currentContainer);

  const domTableRows = document.getElementsByClassName('new-table')[0]
    .childNodes;

  let success = 0;

  interval = setInterval(() => {
    console.log('running');
    if (i >= solutions.length) {
      clearInterval(interval);
      startButton.disabled = false;
    }
    for (let board = i; board < solutions.length; board++) {
      const currentBoard = solutions[board];
      if (currentBoard === 'DONE') {
        i++;
        addBoard(solutions[board - 1]);
        success++;
        foundSolutions.innerHTML = `${success} solutions found`;
        break;
      }

      for (let row = 0; row < domTableRows.length; row++) {
        const currentRow = domTableRows[row].childNodes;

        for (let col = 0; col < domTableRows.length; col++) {
          const currentCol = currentRow[col];

          if (currentBoard[row][col] === 'Q') {
            const queen = document.createElement('img');
            queen.src = 'queen-white.png';
            queen.className = 'queen';
            currentCol.innerHTML = '';
            currentCol.appendChild(queen);
          } else {
            currentCol.innerHTML = currentBoard[row][col];
            currentCol.innerHTML = '';
            if (currentCol.childNodes.length) {
              currentCol.removeChild(currentCol.childNodes[0]);
            }
          }
        }
      }

      i++;

      break;
    }
  }, time);
});

selection.addEventListener('input', (e) => {
  const rowsCols = e.target.value;
  const oldTable = document.getElementsByClassName('new-table')[0];

  const newTable = document.createElement('div');
  newTable.classList = 'new-table';

  for (let i = 0; i < rowsCols; i++) {
    const row = document.createElement('div');
    row.className = 'row';

    for (let j = 0; j < rowsCols; j++) {
      const col = document.createElement('div');

      if (i % 2 === 0) {
        if (j % 2 === 0) col.className = 'col checkered-white';
        else col.className = 'col checkered-black';
      } else {
        if (j % 2 === 0) col.className = 'col checkered-black';
        else col.className = 'col checkered-white';
      }

      row.appendChild(col);
    }
    newTable.appendChild(row);
  }

  tablesContainer.replaceChild(newTable, oldTable);

  sizeLabel.innerHTML = `${rowsCols}x${rowsCols}`;

  foundSolutions.innerHTML = '0 Solutions Found';

  possibleSolutions.innerHTML = `${allSolutions[rowsCols].length} possible solutions`;
});

stopButton.addEventListener('click', () => {
  clearInterval(interval);
  selection.disabled = false;
  speed.disabled = false;
  startButton.disabled = false;
  stopButton.disabled = true;
});

solutionButton.addEventListener('click', () => {
  clearInterval(interval);
  foundSolutions.innerHTML = `${
    allSolutions[selection.value].length
  } solutions found`;
  startButton.disabled = false;
  selection.disabled = false;
  const newSolutions = allSolutions[selection.value];

  const newContainer = document.createElement('div');
  newContainer.id = 'solutions';

  const solContainerDiv = document.getElementsByClassName(
    'solutions-container'
  )[0];

  for (let solNum = 0; solNum < newSolutions.length; solNum++) {
    const currentSolution = newSolutions[solNum];
    const newTable = document.createElement('div');
    newTable.classList = 'solution-table';
    for (let i = 0; i < currentSolution.length; i++) {
      const row = document.createElement('div');
      row.className = 'row';

      for (let j = 0; j < currentSolution.length; j++) {
        const col = document.createElement('div');

        if (i % 2 === 0) {
          if (j % 2 === 0) col.className = 'col checkered-white';
          else col.className = 'col checkered-black';
        } else {
          if (j % 2 === 0) col.className = 'col checkered-black';
          else col.className = 'col checkered-white';
        }

        if (currentSolution[i][j] === 'Q') {
          const queen = document.createElement('img');
          queen.src = 'queen-white.png';
          queen.className = 'queen';
          col.appendChild(queen);
        }

        row.appendChild(col);
      }
      newTable.appendChild(row);
    }
    newContainer.appendChild(newTable);
  }

  const currentContainer = document.getElementById('solutions');
  solContainerDiv.replaceChild(newContainer, currentContainer);
});

speedSlider.addEventListener('input', (e) => {
  const num = Number(e.target.value);
  let labelText = '';

  if (num === 1) labelText = 'Slow';
  else if (num === 2) labelText = 'Medium';
  else if (num === 3) labelText = 'Fast';
  else if (num === 4) labelText = 'Super Fast';
  else if (num === 5) labelText = 'Lighting Speed';

  speedLabel.innerHTML = labelText;
});
