const Gameboard = (() =>{
    let board;

    const resetBoard = ()=>{
        board = [];
        for(let i = 0; i < 9; i++)
        {
            board.push(0);
        }
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
    board = [1,1,1,1,null,-1,-1,-1,1];
    return {board, resetBoard, placeMarker, detectWin};
})();

const DisplayController = (() => {

    const cells = [... document.querySelectorAll("div.game-cell")];
    const infoPanel = document.querySelector("#setup-panel");
    const turnPanel = document.querySelector("#turn-order");

    let cellCount = 0;
    const cellTexts = cells.map(cell => {
        cell.setAttribute("data-index", cellCount++);
        return cell.children[0];
    });

    const markerToSymbol = marker =>{
        if(marker < 0)
            return 'X';
        else if(marker > 0)
            return 'O';
        else
            return '';
    };

    const updateCells = () => {
        for (let i = 0; i < cellCount; i++){
            let marker = Gameboard.board[i];
            cellTexts[i].innerText = markerToSymbol(marker);
        }
    }

    const fetchNames = () => {
        let playerXName = infoPanel.querySelector("#name-x") | 'Player 1';
        let playerOName = infoPanel.querySelector("#name-o") | 'Player 2';
        return [playerXName, playerOName];
    }

    const placeSymbol = elem => {
        let player = GameLogic.currentPlayer();
        let index = elem.getAttribute("data-index");

        Gameboard.placeMarker(index, player);
        elem.classList.add('clicked');
        cellTexts[index].innerText = player.symbol;
    };

    const resetDisplay = () => {
        for (let i = 0; i < cellCount; i++){
            cellTexts[i].innerText = '';
            cells[i].classList.remove('clicked');
            cells[i].removeEventListener('click', ()=>{placeSymbol(cells[i])}, {once:true});
            cells[i].addEventListener('click', ()=>{placeSymbol(cells[i])}, {once:true});
        };

        infoShow(true);
    }

    const startButtonEvent = (elem, firstTurn) => {
        console.log('Begin Game ('+firstTurn+')');
        GameLogic.beginGame(firstTurn);
    }

    const infoShow = isGameStart => {
        if(isGameStart){
            infoPanel.setAttribute('hidden', true);
            turnPanel.removeAttribute('hidden');
        }
        else{
            infoPanel.removeAttribute('hidden');
            turnPanel.setAttribute('hidden', true);
        }
    }

    infoPanel.querySelector('#first-x').addEventListener('click', ()=>{startButtonEvent(this,0)});
    infoPanel.querySelector('#first-o').addEventListener('click', ()=>{startButtonEvent(this,1)});

    console.log(infoPanel.querySelector('#first-o'));

    return{updateCells, fetchNames, placeSymbol, resetDisplay, infoShow};
})();

const GameLogic = (()=> {

    //player 0 is X, player 1 is O
    let turn = 0;
    let players = [];
    let gameOver = true;

    const beginGame = (firstTurn) => {
        let names = DisplayController.fetchNames();
        turn  = firstTurn;
        players[0] = PlayerFactory('X', -1, names[0]);
        players[1] = PlayerFactory('O', 1, names[1]);
        gameOver = false;

        Gameboard.resetBoard();
        DisplayController.resetDisplay();
    }

    const canBeginGame = () => gameOver;

    const currentPlayer = () => players[turn];

    return {beginGame, canBeginGame, currentPlayer};
})();

const PlayerFactory = (symbol, marker, name) =>{
    return {symbol, marker, name};
};

//DisplayController.updateCells();