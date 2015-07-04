	


	$( document ).ready(function() {
  // Handler for .ready() called.
  		$.ajax({
			  method: "GET",
			  url: "/internetBest",
			})
			  .done(function( msg ) {
			   // alert( "Best: " + msg );
			    $("#best").text(msg.trim());
			  });

	});
	var allowedValues = [2,4,8];
	var gameOver = false;
	var timerRunning = false;
	var userBest = 0;
	var userInputs = [];
	function updateTime2() {
		var curTime = parseInt($("#time").text());
		$("#time").text(curTime - 1);
		checkGameOver();
		updateTime();
	}
	function updateTime() {
			if(!gameOver)
			setTimeout(function(){
				updateTime2()
			}
			, 1000);
		}
	
	function updateScore() {
		var curScore = parseInt($("#curScore").text());
		var lValue = parseInt($("#ltext").text());
		var rValue = parseInt($("#rtext").text());
		var incr = Math.abs(lValue - rValue);
		if(incr > 0) {
			$("#curScore").removeClass("fontkaboom");
			$("#curScore").text(curScore + incr);
			$("#curScore").replaceWith($("#curScore").clone(true));
			$("#curScore").addClass("fontkaboom");
		}
		
		// feedback
		if(incr == 8 || incr == 0) {
			$("#feedback").removeClass("boomdissapear");
			if(incr  == 8)
				$("#feedback").text("Sweeet!");
			if(incr == 0)
				$("#feedback").text("Meh!");

			$("#feedback").replaceWith($("#feedback").clone(true));
			$("#feedback").addClass("boomdissapear");
		}

		var newScore = parseInt($("#curScore").text());
		if(newScore > userBest) {
			userBest = newScore;
			$("#userbest").removeClass("colordissapear");
			$("#userbest").text(userBest);
			$("#userbest").replaceWith($("#userbest").clone(true));
			$("#userbest").addClass("colordissapear");
		}
	}

	function checkGameOver() {
		if(gameOver) return;
		var lValue = parseInt($("#ltext").text());
		var rValue = parseInt($("#rtext").text());
		var timesup = false;
		var exceeded8 = false;
		if(parseInt($("#time").text()) <= 0) {
			timesup = true;
		}
		if(Math.abs(lValue - rValue) > 8) {
			exceeded8 = true;
			
		}
		gameOver = exceeded8 || timesup;
		if(timesup) {
			$("#timesup").removeClass("invisible");

		}
		if(exceeded8) {
			$("#exceeded8").removeClass("invisible");
		}
		if(gameOver){

			$("#restart").removeClass("invisible");
			$.ajax({
			  method: "GET",
			  url: "/sendGame?data=".concat(userInputs.toString())
			})
			  .done(function( msg ) {
			  	console.log("Game result saved hopefully");
			   
			  });
			userInputs = [];
		}

	}

	function updateNextRandom() {
		$("#cur").removeClass("kaboom");
		$("#cur").text(allowedValues[Math.floor(Math.random()*3)]);
		$("#cur").replaceWith($("#cur").clone(true));
		$("#cur").addClass("kaboom");
	}

	function doAnimation(ele, val) {
		var el = $(ele);
		var plus = el.find("#plus");
		plus.removeClass("anim");
		plus.text("+"+val);
		plus.replaceWith(plus.clone(true));
		plus = el.find("#plus");
		plus.addClass("anim");

	}

	function leftPressed() {

		var curVal = parseInt($("#cur").text());
		userInputs.push("L"+"-"+curVal);
		if(!timerRunning) {
			timerRunning = true;
			updateTime();
		}

		var lboxValue = parseInt($("#ltext").text());
		$("#ltext").text(curVal + lboxValue);
		
		doAnimation("#lbox", curVal);

		checkGameOver();
		
		updateNextRandom();

		if(!gameOver)
			updateScore();
	}

	function rightPressed() {
		var curVal = parseInt($("#cur").text());
		userInputs.push("R"+"-"+curVal);
		if(!timerRunning) {
			timerRunning = true;
			updateTime();
		}
		var rboxValue = parseInt($("#rtext").text());
		$("#rtext").text(curVal + rboxValue);
		doAnimation("#rbox", curVal);
		checkGameOver();
		
		updateNextRandom();

		if(!gameOver)
			updateScore();
	}
	$("body").on("keydown", function(event) { 
		if(!gameOver) {
			console.log(event.which);
			
			switch(event.which) {
				case 37:
					leftPressed();
					break;
				case 65:
					leftPressed();
					break;
				case 39:
					rightPressed();
					break;
				case 68:
					rightPressed();
					break;

			}
		}

	});

	$("#restart").on('click', function() {
		gameOver = false;
		timerRunning = false;
		$("#timesup").addClass("invisible");
		$("#exceeded8").addClass("invisible");
		$("#restart").addClass("invisible");
		$("#curScore").text(0);
		$("#time").text(60);
		$("#ltext").text(0);
		$("#rtext").text(0);


	})

	function swipedetect(el, callback){
  
	    var touchsurface = el,
	    swipedir,
	    startX,
	    startY,
	    distX,
	    distY,
	    threshold = 30, //required min distance traveled to be considered swipe
	    restraint = 100, // maximum distance allowed at the same time in perpendicular direction
	    allowedTime = 300, // maximum time allowed to travel that distance
	    elapsedTime,
	    startTime,
	    handleswipe = callback || function(swipedir){}
	  
	    touchsurface.addEventListener('touchstart', function(e){
	        var touchobj = e.changedTouches[0]
	        swipedir = 'none'
	        dist = 0
	        startX = touchobj.pageX
	        startY = touchobj.pageY
	        startTime = new Date().getTime() // record time when finger first makes contact with surface
	        e.preventDefault()
	    }, false)
	  
	    touchsurface.addEventListener('touchmove', function(e){
	        e.preventDefault() // prevent scrolling when inside DIV
	    }, false)
	  
	    touchsurface.addEventListener('touchend', function(e){
	        var touchobj = e.changedTouches[0]
	        distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
	        distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
	        elapsedTime = new Date().getTime() - startTime // get time elapsed
	        if (elapsedTime <= allowedTime){ // first condition for awipe met
	            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
	                swipedir = (distX < 0)? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
	            }
	            else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
	                swipedir = (distY < 0)? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
	            }
	        }
	        handleswipe(swipedir)
	        e.preventDefault()
	    }, false)
	}

	var el = document.getElementById('gamearea');
	swipedetect(el, function(swipedir){
	    //swipedir contains either "none", "left", "right", "top", or "down"
	    if (swipedir =='left')
	        leftPressed();
	    if(swipedir == 'right')
	    	rightPressed();
	});
