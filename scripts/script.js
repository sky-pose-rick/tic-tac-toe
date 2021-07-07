const Gameboard = (() =>{
    let board;

    const resetBoard = ()=>{
        board = [];
        for(let i = 0; i < 9; i++)
        {
            board.push(null);
        }
    };

    resetBoard();
    board = [1,1,1,1,null,-1,-1,-1,1];
    return {board, resetBoard};
})();

const DisplayController = (() => {

    const cells = [... document.querySelectorAll("div.game-cell")];
    const infoPanel = document.querySelector("#setup-panel");


    let cellCount = 0;

    const getSymbol = value =>{
        if(value < 0)
            return 'X';
        else if(value > 0)
            return 'O';
        else
            return '';
    };


    const cellTexts = cells.map(cell => {
        cell.setAttribute("data-index", cellCount++);
        return cell.children[0];
    })

    const updateCells = board => {
        console.table(board);
        for (let i = 0; i < 9; i++){
            cellTexts[i].innerText = getSymbol(board[i]);
        }
    }

    return{updateCells};
})();

const GameLogic = (()=> {
    return {};
})();

const PlayerFactory = (symbol) =>{
    return {symbol};
};

//DisplayController.updateCells(Gameboard.board);