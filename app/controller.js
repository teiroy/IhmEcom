'use strict';

angular.module("appControllers", [])

.controller('MainCtrl',
[ '$scope', '$http', function($scope, $http) {
	$scope.pixelShirt = JSON.parse(
		sessionStorage.pixelShirt ||
		'{"backImg" : "../images/cirrus.jpg", "pixelData" : {}}'
	);
	$scope.selectedImg = {};
}])


.controller('WelcomeCtrl',
[ '$scope', function($scope) {

}])

.controller('HelpCtrl',
[ '$scope', function($scope) {

}])

.controller('BackImageCtrl',
[ '$scope', function($scope) {
		// Set up
		$scope.listeImg = [
			{
			  id : "0", url: "http://upload.wikimedia.org/wikipedia/commons/thumb/8/80/US_1.svg/50px-US_1.svg.png"
			},
			{
			  id : "1", url: "http://www.dickson-constant.com/medias/images/catalogue/api/0017-bleu-680.jpg"
			},
			{
			  id : "2", url: "http://www.dickson-constant.com/medias/images/catalogue/api/6028-noir-zoom.jpg"
			},
			{
			  id : "3", url: "http://www.dickson-constant.com/medias/images/catalogue/api/0017-bleu-680.jpg"
			}
			];
		
		$scope.select = function(img) {
			$scope.pixelShirt.backImg = img.url ;
			$scope.selectedImg = img;	
		};
	 
}])
/*
app.controller('customersCtrl', function($scope, $http) {
    $http.get("http://www.w3schools.com/angular/customers.php")
    .then(function(response) {$scope.names = response.data.records;});
});
*/

.controller('DrawingCtrl',
[ '$scope', function($scope) {
  jQuery(document).ready(function () {
	//Set up some globals
    var pixSize = 8, lastPoint = null, currentColor = "000", mouseDown = 0;
    var pixShirt = $scope.$parent.pixelShirt;
	
    // Set up our canvas
    var myCanvas = document.getElementById('drawing-canvas');
    var myContext = myCanvas.getContext ? myCanvas.getContext('2d') : null;
    if (myContext == null) {
      alert("You must use a browser that supports HTML5 Canvas to run this demo.");
      return;
    }
    
    // Background Image
	jQuery(myCanvas).css({
		"background-image" : "url("+pixShirt.backImg+")"
	});
    
	// Reload
	for (var pix in pixShirt.pixelData) {
		var coords = pix.split(":");
		myContext.fillStyle = "#" + pixShirt.pixelData[pix];
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
			delete pixShirt.pixelData[x0+":"+y0];
			myContext.clearRect(x0 * pixSize, y0 * pixSize, pixSize, pixSize);
		} else {
			pixShirt.pixelData[x0+":"+y0] = currentColor;
			myContext.fillStyle = "#" + currentColor;
			myContext.fillRect(x0 * pixSize, y0 * pixSize, pixSize, pixSize);
		}
		// Prendre une photo d'un instant t à stocké dans la session
        sessionStorage.pixelShirt = JSON.stringify(pixShirt);
        

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
    
    //Swipe image to server
    $scope.envoyer = function(){
    	console.log("SWIPE envoyer");
    }
    $scope.recuperer = function(){
    	console.log("SWIPE recuperer");
    }
    
    
  });

}])
