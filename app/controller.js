'use strict';

angular.module("appControllers", [])

.controller('Ctrl',
[ '$scope', function($scope) {
    $scope.firstName = "John";
    $scope.lastName = "Doe";
    $scope.fullName = function() {
        return $scope.firstName + " " + $scope.lastName;
    };
}])

.controller('WelcomeCtrl',
[ '$scope', function($scope) {
   $scope.firstName = "Dohn";
}])

.controller('DrawingCtrl',
[ '$scope', function($scope) {
    // jQuery
	jQuery(document).ready(function () {
	//Set up some globals
    var pixSize = 8, lastPoint = null, currentColor = "000", mouseDown = 0;
	
    // Create a reference to the pixel data for our drawing.
	var pixelData = JSON.parse(sessionStorage.pixelData || "{}");

    // Set up our canvas
    var myCanvas = document.getElementById('drawing-canvas');
    var myContext = myCanvas.getContext ? myCanvas.getContext('2d') : null;
    if (myContext == null) {
      alert("You must use a browser that supports HTML5 Canvas to run this demo.");
      return;
    }
    
	// Reload
	for (var pix in pixelData) {
		var coords = pix.split(":");
		myContext.fillStyle = "#" + pixelData[pix];
		myContext.fillRect(parseInt(coords[0]) * pixSize, parseInt(coords[1]) * pixSize, pixSize, pixSize);
	}

    // Setup each color palette & add it to the screen
    var colors = ["fff","000","f00","0f0","00f","88f","f8d","f88","f05","f80","0f8","cf0","08f","408","ff8","8ff"];
    for (var c in colors) {
      var item = jQuery('<div/>').css("background-color", '#' + colors[c]).addClass("colorbox");
      item.click((function () {
        var col = colors[c];
        return function () {
          currentColor = col;
        };
      })());
      item.appendTo('#colorholder');
    }
    
    //Keep track of if the mouse is up or down
    myCanvas.onmousedown = function () {mouseDown = 1;};
    myCanvas.onmouseout = myCanvas.onmouseup = function () {
      mouseDown = 0; lastPoint = null;
    };

    //Draw a line from the mouse's last position to its current position
    var drawLineOnMouseMove = function(e) {
      if (!mouseDown) return;

      e.preventDefault();

      // Bresenham's line algorithm. We use this to ensure smooth lines are drawn
      var offset = jQuery('canvas').offset();
      var x1 = Math.floor((e.pageX - offset.left) / pixSize - 1),
        y1 = Math.floor((e.pageY - offset.top) / pixSize - 1);
      var x0 = (lastPoint == null) ? x1 : lastPoint[0];
      var y0 = (lastPoint == null) ? y1 : lastPoint[1];
      var dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
      var sx = (x0 < x1) ? 1 : -1, sy = (y0 < y1) ? 1 : -1, err = dx - dy;
      while (true) {
        //write the pixel or if we are drawing white, remove the pixel
        if (currentColor === "fff") {
			delete pixelData[x0+":"+y0];
			myContext.clearRect(x0 * pixSize, y0 * pixSize, pixSize, pixSize);
		} else {
			pixelData[x0+":"+y0] = currentColor;
			myContext.fillStyle = "#" + currentColor;
			myContext.fillRect(x0 * pixSize, y0 * pixSize, pixSize, pixSize);
		}
		// Prendre une photo d'un instant t à stocké dans la session
        sessionStorage.pixelData = JSON.stringify(pixelData);
        

        if (x0 == x1 && y0 == y1) break;
        var e2 = 2 * err;
        if (e2 > -dy) {
          err = err - dy;
          x0 = x0 + sx;
        }
        if (e2 < dx) {
          err = err + dx;
          y0 = y0 + sy;
        }
      }
      lastPoint = [x1, y1];
    };
    $(myCanvas).mousemove(drawLineOnMouseMove);
    $(myCanvas).mousedown(drawLineOnMouseMove);
  });

}])
