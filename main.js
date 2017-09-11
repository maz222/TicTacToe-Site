$(document).ready(function() {
	var $cells = $(".cell");
	$cells.click(function() {
		playerMove(this);
	});
	$("#restart-button").click(function() {
		restartGame();
	})
})