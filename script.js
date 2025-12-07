// Tic Tac Toe (IDs expected by tests: #player1, #player2, #submit, .message, cells with id 1..9)
(function(){
  const playerForm = document.getElementById('player-form');
  const input1 = document.getElementById('player1');
  const input2 = document.getElementById('player2');
  const setupScreen = document.getElementById('setup-screen');
  const gameScreen = document.getElementById('game-screen');
  const messageEl = document.querySelector('.message');
  const boardEl = document.getElementById('board');
  const cells = Array.from(document.querySelectorAll('.cell'));
  const restartBtn = document.getElementById('restart');

  let players = { p1: 'Player1', p2: 'Player2' };
  let current = 'p1';
  let boardState = Array(9).fill(null);
  let gameOver = false;

  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  function showTurn(){
    if(gameOver) return;
    const name = current === 'p1' ? players.p1 : players.p2;
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
      c.classList.remove('x','o','disabled','win');
    });
    gameOver = false;
  }

  function checkWin(){
    for(const combo of wins){
      const [a,b,c] = combo;
      if(boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]){
        return { win:true, combo, marker: boardState[a] };
      }
    }
    return null;
  }

  function cellForIndex(i){ return cells[i]; }

  function handleCellClick(e){
    if(gameOver) return;
    const cell = e.target.closest('.cell');
    if(!cell) return;
    const idx = parseInt(cell.dataset.index,10) - 1;
    if(isNaN(idx) || boardState[idx]) return;

    const marker = current === 'p1' ? 'X' : 'O';
    boardState[idx] = marker;
    cell.textContent = marker;
    cell.classList.add(marker === 'X' ? 'x' : 'o', 'disabled');

    const result = checkWin();
    if(result){
      gameOver = true;
      result.combo.forEach(i => cellForIndex(i).classList.add('win'));
      const winnerName = result.marker === 'X' ? players.p1 : players.p2;
      showWinner(winnerName);
      return;
    }

    if(boardState.every(v => v !== null)){
      gameOver = true;
      showDraw();
      return;
    }

    current = current === 'p1' ? 'p2' : 'p1';
    showTurn();
  }

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

    setupScreen.style.display = 'none';
    gameScreen.style.display = 'block';

    current = 'p1';
    resetBoardUI();
    showTurn();
  });

  boardEl.addEventListener('click', handleCellClick);

  restartBtn.addEventListener('click', function(){
    resetBoardUI();
    current = 'p1';
    showTurn();
  });

  // allow Enter in second input to submit
  input2.addEventListener('keydown', function(e){
    if(e.key === 'Enter') playerForm.requestSubmit();
  });

  // initial
  resetBoardUI();
})();
