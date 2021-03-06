var platforms = require("./js/platformsClient.js");
var dessin = require("./js/dessin.js");

angular	.module('testMM', [])
		.controller	( 'testMMController', function ($scope) {
						 this.messageReceived = "";
						 var testMMController	= this;
						 this.platforms			= platforms.array;
						 this.sendMessage = function(id,message){
							platforms.send(id,'test',message);
							};

						 //TEST ENVOI IMAGE SOUS BYTES[]
						 var canvas = document.getElementById("myCanvas");
						 dessin(canvas);
						 var ctx=canvas.getContext("2d");
						 //var io = require('socket.io')(8090);
						 this.sendImage = function(id){
						 		var imgData=ctx.getImageData(0,0,200,100);
						 		var msg = {w:imgData.width, h:imgData.height, data:imgData.data.buffer};
								platforms.send(id,'testImage',msg);
								console.log("send : ", msg);
						 };

						 this.getImage = function(id){
						 		//TODO recup id source
								var msg = platforms.get(id, this.id,'get');
								console.log("get : ", msg);
						 };

						 console.log(testMMController);
						 platforms.init		( "/MM" );
						 platforms.subscribe( function() {$scope.$apply()}
											);
						 platforms.on('test', function(message){
							testMMController.messageReceived = message;
							$scope.$apply();
						  });

						 //platforms.on('get', function(msg){
							//console.log(msg);
							//testMMController.imageReceived = arrayBuffer;
							//var data = new Uint8ClampedArray(msg.data);
							//var imageData = new ImageData(data, msg.w, msg.h);
							//ctx.putImageData(imageData,0,0);
						  //});

						 platforms.on('testImage', function(msg){
						 	console.log(msg);
							//testMMController.imageReceived = arrayBuffer;
							//var data = new Uint8ClampedArray(msg.data);
							//var imageData = new ImageData(data, msg.w, msg.h);
							//ctx.putImageData(imageData,0,0);
							//testMMController.imageReceived = imageData;
							//$scope.$apply();
						  });


						 
						 // io.on('connection', function(socket){
						 //   fs.readFile('image.png', function(err, buf){
						 //     // it's possible to embed binary data
						 //     // within arbitrarily-complex objects
						 //     socket.emit('image', { image: true, buffer: buf });
						 //   });
						 // });

						}
					);

