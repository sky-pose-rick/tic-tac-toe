const Gameboard = (() =>{
    let board;

    const resetBoard = ()=>{
        board = [];
        for(let i = 0; i < 9; i++)
        {
            board.push(0);
        }
    };

    const getMarker = (index) => {
        return board[index];
    };

    const placeMarker = (index, player) => {
        board[index] = player.marker;
    };

    const detectWin = (player) => {
        //3 rows, 3 cols, 2 diagonals as win conditions
        //diagonals are {(0,0),(1,1),(2,2)} and {(0,2),(1,1),(2,0)}
        let counters = [];
        for(let i = 0; i < 8; i++)
            counters.push(0);
        for(let x = 0; x < 3; x++){
            for (let y = 0; y < 3; y++){
                let index = x*3+y;
                let value = board[index];
                //row
                counters[x] += value;
                //col
                counters[3+y] += value;
                //diagonals
                if(x+y === 2)
                    counters[6] += value;
                if(x===y)
                    counters[7] += value;
            }
        }

        //find any 3 in a row
        const win = count => (player.marker * count === 3);
        return counters.some(win);
    }

    resetBoard();
    return {board, resetBoard, placeMarker, detectWin, getMarker};
})();

const DisplayController = (() => {

    const cellDiv = document.querySelector('#gameboard');
    const infoPanel = document.querySelector("#setup-panel");
    const turnPanel = document.querySelector("#turn-order");

    let cells = [];
    let cellTexts = [];
    let cellCount = 0;

    //discard event listeners by redrawing grid
    const createCell = (innerText, clicked) =>{
        let newCell = document.createElement('div');
        newCell.classList.add('game-cell');
        newCell.setAttribute('data-index', cellCount++);

        let newText = document.createElement('p');
        newText.classList.add('cell-text');
        newText.innerText = innerText;

        if(clicked)
            newCell.classList.add('clicked');
        newCell.appendChild(newText);
        cellDiv.appendChild(newCell);

        cells.push(newCell);
        cellTexts.push(newText);
    };

    const markerToSymbol = marker =>{
        if(marker < 0)
            return 'X';
        else if(marker > 0)
            return 'O';
        else
            return '';
    };

    const fetchNames = () => {
        let playerXName = infoPanel.querySelector("#name-x").value || 'Player 1';
        let playerOName = infoPanel.querySelector("#name-o").value || 'Player 2';
        return [playerXName, playerOName];
    }

    const placeSymbol = elem => {
        let player = GameLogic.currentPlayer();
        let index = elem.getAttribute("data-index");

        Gameboard.placeMarker(index, player);
        elem.classList.add('clicked');
        cellTexts[index].innerText = player.symbol;

        GameLogic.nextTurn();
    };

    const resetDisplay = () => {
        cellCount = 0;
        cellDiv.innerHTML = '';
        cells = [];
        cellTexts = [];
        for (let i = 0; i < 9; i++){
            createCell('', false);
            cells[i].addEventListener('click', (placeSymbol.bind(cells[i], cells[i])), {once:true});
        };

        infoHide(true);
    }

    const startX = () => {
        console.log('Begin Game (X)');
        GameLogic.beginGame(0);
    }

    const startO = () => {
        console.log('Begin Game (O)');
        GameLogic.beginGame(1);
    }

    const infoHide = () => {
        infoPanel.setAttribute('hidden', true);
        turnPanel.removeAttribute('hidden');
    }

    const updateTurnText = player => {
        turnPanel.innerText = `Your turn, ${player.name}. Place an ${player.symbol}.`;
    };

    const endText = (player, isDraw) => {
        infoPanel.removeAttribute('hidden');
        if(isDraw){
            turnPanel.innerText = `Tie Game!`;
        }
        else{
            turnPanel.innerText = `${player.name} (${player.symbol}) Wins!`;
        }

        cellCount = 0;
        cellDiv.innerHTML = '';
        cells = [];
        cellTexts = [];
        for (let i = 0; i < 9; i++){
            createCell(markerToSymbol(Gameboard.getMarker(i)), Gameboard.getMarker(i) !== 0);
        };
    }

    infoPanel.querySelector('#first-x').addEventListener('click', startX);
    infoPanel.querySelector('#first-o').addEventListener('click', startO);

    return{fetchNames, placeSymbol, resetDisplay, infoHide, updateTurnText, endText};
})();

const GameLogic = (()=> {

    //player 0 is X, player 1 is O
    let playerIndex = 0;
    let turnCount = 0;
    let players = [];
    let gameOver = true;

    const beginGame = (firstTurn) => {
        let names = DisplayController.fetchNames();
        playerIndex  = firstTurn;
        players[0] = PlayerFactory('X', -1, names[0]);
        players[1] = PlayerFactory('O', 1, names[1]);
        gameOver = false;
        turnCount = 0;

        Gameboard.resetBoard();
        DisplayController.resetDisplay();
        DisplayController.updateTurnText(currentPlayer());
    }

    const nextTurn = () => {
        if(Gameboard.detectWin(currentPlayer())){
            DisplayController.endText(currentPlayer(), false);
            gameOver = true;
        }
        else if(turnCount === 8){
            DisplayController.endText(currentPlayer(), true);
            gameOver = true;
        }
        else{
            playerIndex = 1 - playerIndex;
            turnCount++;

            DisplayController.updateTurnText(currentPlayer());
        }
    };

    const canBeginGame = () => gameOver;

    const currentPlayer = () => players[playerIndex];

    return {beginGame, canBeginGame, currentPlayer, nextTurn};
})();

const PlayerFactory = (symbol, marker, name) =>{
    return {symbol, marker, name};
};

//DisplayController.updateCells();