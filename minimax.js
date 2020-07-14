var boardGame;
var currentTurnLabel = $("#currentTurn");
var twoPlayers = false;
var player = 'X';
var player_2 = 'O';
var currentTurn = player;
var gameIsOver = 1;
var alpha =Number.MIN_SAFE_INTEGER;
var beta =Number.MAX_SAFE_INTEGER;
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]
];

const cells = $(".cell");

function startGame() {
    $("table").animate({
        opacity: "1"
    });
    cells.on('click', turnClick);
    gameIsOver = 0;
    $(".end-game").value = "none";
    boardGame = Array.from(Array(9).keys());
    cleanBoard();
}

function endGame() {
    $("table").animate({
        opacity: "0.4"
    });
    gameIsOver = 1;
    cleanBoard();
    currentTurnLabel.text("- - - - - - - -");
    cells.off('click');
}

function turnClick(square) {
    if (typeof(boardGame[square.target.id]) == "number") {
        turn(square.target.id, currentTurn);
        if (!checkWin(boardGame, player) && !checkTie()) {
            if (twoPlayers === false) {
                cells.off('click');
                setTimeout(function() {
                    currentTurnLabel.text("Is your turn: " + player);
                    cells.on('click', turnClick);
                    turn(bestChoice(), player_2);
                }, 700);
            }
        }
    }
}

function turn(boxId, player) {
    currentPlayer = player == 'X' ? 'O' : 'X';
    currentTurnLabel.text("Is your turn: " + currentPlayer);
    boardGame[boxId] = player;
    $("#" + boxId).text(player);
    let gameFinished = checkWin(boardGame, player);
    if (gameFinished) {
        gameOver(gameFinished);
    }
    currentTurn = currentTurn == 'X' ? 'O' : 'X';
}

function miniMax(newGameBoard, currentPlayer, alpha, beta) {
    var availableMoves = getAvailableMoves();

    if (checkWin(newGameBoard, player)) {
        return {
            score: -10
        };
    } else if (checkWin(newGameBoard, player_2)) {
        return {
            score: 10
        };
    } else if (availableMoves.length === 0) {
        return {
            score: 0
        };
    }

    var moves = [];
    for (var i = 0; i < availableMoves.length; i++) {
        var move = {};
        move.index = newGameBoard[availableMoves[i]];
        newGameBoard[availableMoves[i]] = currentPlayer;

        if (currentPlayer == player_2) {
            var maxScoreIndex = miniMax(newGameBoard, player,alpha,beta);
            move.score = maxScoreIndex.score;
        } else {
            var maxScoreIndex = miniMax(newGameBoard, player_2,alpha,beta);
            move.score = maxScoreIndex.score;
        }

        newGameBoard[availableMoves[i]] = move.index;

        moves.push(move);
    }

    var bestChoice;
    if (currentPlayer === player_2) {
        var bestScore = -10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                if(alpha<bestScore)
                alpha = bestScore;
                if(beta<=alpha)
                break;
                bestChoice = i;
                
            }
        }
    } else {
        var bestScore = 10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                if(beta>bestScore)
                beta = bestScore;
                if(beta<=alpha)
                break;
                bestChoice = i;
            }
        }
    }

    return moves[bestChoice];
}

function checkWin(board, player) {
    let plays = board.reduce(
        (acc, elem, index) => (elem === player) ? acc.concat(index) : acc, []);
    let gameFinished = null;
    for (let [index, win] of winCombos.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameFinished = {
                index: index,
                player: player
            };
            break;
        }
    }
    return gameFinished;
}

function gameOver(gameFinished) {
    gameIsOver = 1;
    cells.off('click');
    cells.animate({
        opacity: '0.4'
    });
    for (let index of winCombos[gameFinished.index]) {
        setTimeout(function() {
            $("#" + index).css("background-color", "green");
            $("#" + index).animate({
                opacity: '1'
            });
            $("#currentTurn").text(gameFinished.player + " WIN");
        }, 500);
    }
}

function getAvailableMoves() {
    return boardGame.filter(s => typeof s == 'number');
}

function checkTie() {
    if (getAvailableMoves().length === 0) {gameIsOver = 1;
	    cells.off('click');
	    cells.animate({
	        opacity: '0.4'
	    });
        currentTurnLabel.text("TIE GAME!");
        return true;
    }
    return false;
}

function bestChoice() {
    return miniMax(boardGame, player_2,alpha,beta).index;
}

function cleanBoard() {
    for (var i = 0; i < cells.length; i++) {
        $("#" + i).text("");
    }

    for (var i = 0; i < cells.length; i++) {
        cells[i].value = '';
        cells[i].style.removeProperty('background-color');
        cells[i].style.removeProperty('opacity');
        cells.on('click', turnClick);
    }
    currentTurnLabel.text("Is your turn: " + player);
}

function changeFigures() {
    if (gameIsOver === 1) {
        currentTurn = currentTurn == player ? player_2 : player;
        player = player == 'X' ? 'O' : 'X';
        player_2 = player_2 == 'X' ? 'O' : 'X';
        currentFigureP1 = $("#f1").text();
        $("#f1").animate({
            opacity: "0"
        });
        $("#f2").animate({
            opacity: "0"
        });
        setTimeout(function() {
            $("#f1").text(currentFigureP1 = currentFigureP1 == 'X' ? 'O' : 'X');
            $("#f2").text(currentFigureP1 = currentFigureP1 == 'X' ? 'O' : 'X');
        }, 500);
        $("#f1").animate({
            opacity: "1"
        });
        $("#f2").animate({
            opacity: "1"
        });
    }
}

function activeTwoPlayers() {
    if (gameIsOver === 1) {
        if (twoPlayers) {
            $("#p2").animate({
                opacity: "0.3"
            });
        } else {
            $("#p2").animate({
                opacity: "1"
            });
        }
        twoPlayers = twoPlayers == true ? false : true;
    }
}