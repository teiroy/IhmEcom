var platforms = require("./js/platformsClient.js");
var dessin = require("./js/dessin.js");

angular	.module('myApp')
		.controller	( 'sendController', function ($scope) {

						var myCanvas = document.getElementById('drawing-canvas');
						var myId;
						   this.platforms     = platforms.array;
						   
						  this.sendMessage = function(id,message){
						  	platforms.send(id,'test',message);
						  };

						  this.sendImage = function(){
						  //var imgData=ctx.getImageData(0,0,200,100);
						  //var msg = {w:imgData.width, h:imgData.height, data:imgData.data.buffer};
						  	console.log("Sending");
						  	platforms.send(1,'sendImage',$scope.pixelShirt);
						  	console.log("send : ", sessionStorage);
						  };

						  

						 // console.log(testMMController);
						  platforms.init   ( "/MM" );

						  platforms.subscribe( function() {$scope.$apply()}
						  );
						  platforms.on('test', function(message){
						    testMMController.messageReceived = message;
						    $scope.$apply();
						  });

						  platforms.on('yourId', function(msg){
							 myId=msg;
							 console.log("Identifiant de la plateforme initialisé :", myId);
						    });

						   this.getImage = function(){
						 		//TODO recup id source
								platforms.get('getImage', myId);
						  };

						  platforms.on('getImage', function(msg){
							var pixShirt = msg;
						    var pixSize = 8, lastPoint = null, currentColor = "000", mouseDown = 0;
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
						   // $scope.pixelShirt = JSON.parse(msg);
						    $scope.$apply();
						  });

						  platforms.on('sendImage', function(msg){
						    console.log(msg);
						    var pixShirt = msg;
						    var pixSize = 8, lastPoint = null, currentColor = "000", mouseDown = 0;
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
						   // $scope.pixelShirt = JSON.parse(msg);
						    $scope.$apply();
						  });
						}
					);

