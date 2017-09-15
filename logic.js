const humanVal = -1;
const humanText = "X";

const computerText = "O";
const computerVal = 1;

const emptyCell = 0;

var currentPlayer = humanVal;
var gameOver = false;

function checkWinner(grid, player) {
	//horizontal
	if(grid[0][0] == player && grid[0][1] == player && grid[0][2] == player) {
		return true;
	}
	if(grid[1][0] == player && grid[1][1] == player && grid[1][2] == player) {
		return true;
	}
	if(grid[2][0] == player && grid[2][1] == player && grid[2][2] == player) {
		return true;
	}
	//vertical
	if(grid[0][0] == player && grid[1][0] == player && grid[2][0] == player) {
		return true;
	}
	if(grid[0][1] == player && grid[1][1] == player && grid[2][1] == player) {
		return true;
	}
	if(grid[0][2] == player && grid[1][2] == player && grid[2][2] == player) {
		return true
	}
	//diagonal
	if(grid[0][0] == player && grid[1][1] == player && grid[2][2] == player) {
		return true;
	}
	if(grid[0][2] == player && grid[1][1] == player && grid[2][0] == player) {
		return true;
	}
}
function checkTie(grid) {
	for(col = 0; col < 3; col++) {
		for(row = 0; row < 3; row++) {
			if(grid[col][row] == emptyCell) {
				return false;
			}
		}
	}
	return true;
}

function getGrid() {
	var grid = [[0,0,0],[0,0,0],[0,0,0]];
	var $cells = $(".cell");
	var row = 0;
	var col = 0;
	$cells.each(function() {
		var text = $($(this).children()[0]).text();
		if(text == humanText) {
			grid[col][row] = humanVal;
		}
		else if(text == computerText) {
			grid[col][row] = computerVal;
		}
		else {
			grid[col][row] = emptyCell;
		}
		row++;
		if(row == 3){
			row = 0;
			col++;
		}
	})
	return grid;
}

function printGrid(grid) {
	console.log("----");
	for(row in grid) {
		console.log(grid[row]);
	}
	console.log("----");
}

function getEmptyCells(grid) {
	var moves = [];
	for(col = 0; col < 3; col++) {
		for(row = 0; row < 3; row++) {
			if(grid[col][row] == emptyCell) {
				moves.push([col,row]);
			}
		}
	}
	return moves;
}

function processMoves(moves, player) {
	bestMove = null;
	bestDepth = null;
	if(player == computerVal) {
		var bestScore = -1000;
		for(move in moves) {
			if(moves[move]["score"] == bestScore) {
				if(moves[move]["depth"] < bestDepth) {
				bestScore = moves[move]["score"];
				bestMove = move;
				bestDepth = moves[move]["depth"];
				}
			}
			else if(moves[move]["score"] > bestScore) {
				bestScore = moves[move]["score"];
				bestMove = move;
				bestDepth = moves[move]["depth"];
			}
		}
	}
	else {
		var bestScore = 1000;
		for(move in moves) {
			if(moves[move]["score"] == bestScore) {
				if(moves[move]["depth"] < bestDepth) {
					bestScore = moves[move]["score"];
					bestMove = move;
					bestDepth = moves[move]["depth"];
				}
			}
			else if(moves[move]["score"] < bestScore) {
				bestScore = moves[move]["score"];
				bestMove = move;
				bestDepth = moves[move]["depth"];
			}
		}
	}
	return moves[bestMove];
}

function minimax(grid, player, depth) {
	if(checkWinner(grid, humanVal)) {
		return {"score":-10, "depth":depth};
	}
	if(checkWinner(grid, computerVal)) {
		return {"score":10, "depth":depth};
	}
	var emptyCells = getEmptyCells(grid);
	if(emptyCells.length == 0) {
		return {"score":0, "depth":depth};
	}

	var moves = [];
	for(cell in emptyCells) {
		// get a available cell
		var move = {"cords":emptyCells[cell]};
		// move / mark that cell
		grid[move["cords"][0]][move["cords"][1]] = player;
		//recurse
		var moveScore = null;
		if(player == humanVal) {
			minimaxVal = minimax(grid, computerVal, depth + 1);
			move["score"] = minimaxVal["score"];
			move["depth"] = minimaxVal["depth"]
		}
		else {
			minimaxVal = minimax(grid, humanVal, depth + 1);
			move["score"] = minimaxVal["score"];
			move["depth"] = minimaxVal["depth"]		
		}
		//undo the move
		grid[move["cords"][0]][move["cords"][1]] = emptyCell;
		moves.push(move);
	}
	return processMoves(moves, player);
}

function playerMove(cell) {
	if(gameOver == true) {
		return;
	}
	//mark player's move
	$($(cell).children()[0]).text(humanText);
	$("#header-text").text("Computer's turn");
	$("#header").removeClass("player-color");
	$("#header").addClass("computer-color");
	var grid = getGrid();
	if(checkWinner(grid, humanVal)) {
		//game over!!!
		$("#header-text").text("Player wins!");
		gameOver = true;
		return;
	}
	else if(checkTie(grid)) {
		$("#header-text").text("Tie game!");
		$("#header").addClass("tie-color");
		gameOver = true;
		return;
	}
	else {
		var computerMove = minimax(grid, computerVal, 0)["cords"];
		console.log(computerMove);
		var flatVal = computerMove[0] * 3 + computerMove[1];
		var $targetCell = $($(".cell").get(flatVal));
		$($targetCell.children()[0]).text(computerText);
		$targetCell.addClass("occupied-cell");
		$targetCell.addClass("computer-color");
		$targetCell.removeClass("cell-hover");
		grid = getGrid();
		printGrid(grid);
		if(checkWinner(grid, computerVal)) {
			//game over!!!
			$("#header-text").text("Computer wins!");
			gameOver = true;
			return;
		}
	}
	$("#header-text").text("Player's turn");
	$("#header").removeClass("computer-color");
	$("#header").addClass("player-color");
}

function restartGame() {
	gameOver = false;
	var $cells = $(".cell");
	$cells.each(function() {
		$($(this).children()[0]).text("");
		$(this).removeClass("occupied-cell");
		$(this).removeClass("player-color");
		$(this).removeClass("computer-color");
		$(this).addClass("cell-hover");
	})
	$("#header-text").text("Player's turn");
	$("#header").removeClass("computer-color");
	$("#header").removeClass("tie-color");
	$("#header").addClass("player-color");
}