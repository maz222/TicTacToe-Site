$(document).ready(function() {
	var $cells = $(".cell");
	$cells.click(function() {
		if(!$(this).hasClass("occupied-cell")) {
			playerMove(this);
			$(this).addClass("occupied-cell");
			$(this).removeClass("cell-hover");
		}
	});
	$("#restart-button").click(function() {
		restartGame();
	})
})