const Gameboard = (() =>{
    let board;

    const resetBoard = ()=>{
        board = [];
        for(let i = 0; i < 9; i++)
        {
            board.push(0);
        }
    };

    const getSymbol = index =>{
        if(board[index] < 0)
            return 'X';
        else if(board[index] > 0)
            return 'O';
        else
            return '';
    };

    const placeSymbol = (elem, player) => {
        let index = elem.getAttribute("data-index");
        board[i] = player.marker;
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
    return {board, resetBoard, placeSymbol, detectWin};
})();

const DisplayController = (() => {

    const cells = [... document.querySelectorAll("div.game-cell")];
    const infoPanel = document.querySelector("#setup-panel");


    let cellCount = 0;

    const cellTexts = cells.map(cell => {
        cell.setAttribute("data-index", cellCount++);
        return cell.children[0];
    })

    const updateCells = board => {
        console.table(board);
        for (let i = 0; i < 9; i++){
            cellTexts[i].innerText = Gameboard.getSymbol(i);
        }
    }

    return{updateCells};
})();

const GameLogic = (()=> {
    return {};
})();

const PlayerFactory = (symbol) =>{
    let marker = 0;
    let name = 'blank';
    return {symbol, marker, name};
};

//DisplayController.updateCells(Gameboard.board);