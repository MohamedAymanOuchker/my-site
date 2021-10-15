// Loader

$(document).ready(function() {

	setTimeout(function(){
		$('body').addClass('loaded');
		$('h1').css('color','#222222');
	}, 3000);

});

// Animation

$(document).ready(function(e) {
	var width = $(document).width();

	function goRight() {
		$(".animate").animate({
			left: width
		}, 80000, function() {
			setTimeout(goLeft, 50);
		});
	}

	function goLeft() {
		$(".animate").animate({
			left: 0
		}, 80000, function() {
			setTimeout(goRight, 50);
		});
	}

	setTimeout(goRight, 50);
});
