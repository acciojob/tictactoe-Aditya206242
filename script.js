//your JS code here. If required.
// script.js - Tic Tac Toe logic
(function(){
  const playerForm = document.getElementById('player-form');
  const input1 = document.getElementById('player-1');
  const input2 = document.getElementById('player-2');
  const setupScreen = document.getElementById('setup-screen');
  const gameScreen = document.getElementById('game-screen');
  const messageEl = document.getElementById('message');
  const boardEl = document.getElementById('board');
  const cells = Array.from(document.querySelectorAll('.cell'));
  const restartBtn = document.getElementById('restart');

  let players = { p1: 'Player 1', p2: 'Player 2' };
  let current = 'p1'; // 'p1' or 'p2'
  let boardState = Array(9).fill(null); // indices 0..8
  let gameOver = false;

  // Winning combinations (0-based)
  const wins = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // cols
    [0,4,8], [2,4,6]           // diagonals
  ];

  // show message function
  function showTurn(){
    if(gameOver) return;
    const name = current === 'p1' ? players.p1 : players.p2;
    const marker = current === 'p1' ? 'X' : 'O';
    messageEl.textContent = `${name}, you're up`;
  }

  function showWinner(name){
    messageEl.textContent = `${name}, congratulations you won!`;
  }

  function showDraw(){
    messageEl.textContent = `It's a draw!`;
  }

  function resetBoardUI(){
    boardState.fill(null);
    cells.forEach(c => {
      c.textContent = '';
      c.classList.remove('x', 'o', 'disabled', 'win');
    });
    gameOver = false;
  }

  // map index (0..8) to cell element
  function cellForIndex(i){
    return cells[i];
  }

  // check win and return {win:true, combo, winner:'p1'/'p2'} or null
  function checkWin(){
    for(const combo of wins){
      const [a,b,c] = combo;
      if(boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]){
        return { win: true, combo, marker: boardState[a] };
      }
    }
    return null;
  }

  // handle click on a cell
  function handleCellClick(e){
    if(gameOver) return;
    const cell = e.target.closest('.cell');
    if(!cell) return;

    const idx = parseInt(cell.dataset.index, 10) - 1; // dataset is "1".. "9"
    if(isNaN(idx) || boardState[idx]) return; // ignore if occupied

    const marker = current === 'p1' ? 'X' : 'O';
    // update state
    boardState[idx] = marker;
    // update UI
    cell.textContent = marker;
    cell.classList.add(marker === 'X' ? 'x' : 'o', 'disabled');

    // check win
    const result = checkWin();
    if(result){
      gameOver = true;
      // highlight winning cells
      result.combo.forEach(i => cellForIndex(i).classList.add('win'));
      const winnerName = result.marker === 'X' ? players.p1 : players.p2;
      showWinner(winnerName);
      return;
    }

    // check draw
    if(boardState.every(v => v !== null)){
      gameOver = true;
      showDraw();
      return;
    }

    // switch turn
    current = current === 'p1' ? 'p2' : 'p1';
    showTurn();
  }

  // Start game after form submit
  playerForm.addEventListener('submit', function(ev){
    ev.preventDefault();
    const p1 = input1.value.trim();
    const p2 = input2.value.trim();
    if(!p1 || !p2){
      alert('Please enter both player names.');
      return;
    }
    players.p1 = p1;
    players.p2 = p2;

    // hide setup, show game
    setupScreen.style.display = 'none';
    gameScreen.style.display = 'block';

    // initialize
    current = 'p1';
    resetBoardUI();
    showTurn();
  });

  // click on board (event delegation)
  boardEl.addEventListener('click', handleCellClick);

  // restart button - return to setup or just reset? Here we reset board and keep players.
  restartBtn.addEventListener('click', function(){
    resetBoardUI();
    current = 'p1';
    showTurn();
  });

  // Allow pressing Enter in inputs to submit
  input2.addEventListener('keydown', function(e){
    if(e.key === 'Enter'){
      playerForm.requestSubmit();
    }
  });

  // On initial load show setup (already visible)
  resetBoardUI();

})();
