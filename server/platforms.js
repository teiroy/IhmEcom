var platforms	= {}
  , sio
  , idPtf		= 0;

var idDis;

module.exports = {
	  getPlatforms			: function() {
		 var res = [];
		 for(var p in platforms) {
			 res.push( { id	: p, platform: platforms[p].descr, obj: platforms[p].obj} );
			}
		 return res;
		}
	, init					: function(ioRef, roomName) {
		 var self = this;
		 if(roomName) {sio	= ioRef.of( roomName );} else {sio = ioRef;}
		 sio.on	( 'connection'
				, function (socket) {
					 socket.on( 'disconnect'
							  , function() {self.removeSocketClient(socket);}
							  );
					 socket.on( 'register'
							  , function(descr, fctCB) {
									 self.appendSocketClient(socket, descr, fctCB);
									}
							  );
					 socket.on( "update"
							  , function(descr) {
									 self.updateSocketClient(socket, descr);
									}
							  );
					 socket.on( "broadcast"
							  , function(message) {
									 io.emit( message.title, message.body );
									}
							  );
					 socket.on( "send"
							  , function(message){
									//message contient target l'identifiant de la plateforme à qui on envoie le msg
									//body le message à transmettre
									//attribut title dans l'objet
									if (platforms[message.target]) {
										platforms[0].socket.emit(message.title,message.source,message.body);
										//test.id = message.target;
										platforms[message.source].obj = message.body;
										console.log(platforms[message.source].obj);
										idDis = message.source;
										//test.data = message.body;
										}
									}
							 );
					  socket.on( "get"
							  , function(message){
									//message contient target l'identifiant de la plateforme à qui on envoie le msg
									//body le message à transmettre
									//attribut title dans l'objet
										//platforms[message.source].socket.emit(message.title,test.data);
										platforms[message.source].socket.emit(message.title,platforms[idDis].obj);
										
									}
							 );
					  socket.on( "changeDisplay"
							  , function(message){
									//message contient target l'identifiant de la plateforme à qui on envoie le msg
									//body le message à transmettre
									//attribut title dans l'objet
										idDis = message.idDisplayed;
										console.log("idDisplayed", this.idDis);
										platforms[0].socket.emit(message.title,platforms[idDis].obj);
										
									}
							 );
					}
				);
		 return this;
		}
	, getPlatformFromSocket	: function(socket) {
		 for(var p in platforms) {
			 if(platforms[p].socket === socket) {
				 return { id		: p
						, platform	: platforms[p].descr
						, obj : platforms[p].obj
						};
				}
			}
		 return null;
		}
	, appendSocketClient	: function(socket, descr, fctCB) {
		 var id	= idPtf++;
		 platforms[id]	= { socket	: socket
						  , descr	: descr
						  , obj:{}
						  };
		 if(fctCB) {
			 fctCB( id );
			}
		 socket.emit("platforms", this.getPlatforms());
		 platforms[id].socket.emit("yourId",id);
		 sio.emit("append", this.getPlatformFromSocket(socket));
		 return id;
		}
	, removeSocketClient	: function(socket) {
		 for(var p in platforms) {
			 if(platforms[p].socket === socket) {
				 sio.emit("remove", {id: p});
				 delete platforms[p];
				 break;
				}
			}
		 return this;
		}
	, updateSocketClient	: function(socket, descr) {
		 var record	= this.getPlatformFromSocket(socket)
		 if(record) {
			 var platform	= record.platform;
			 for(var d in descr) {
				 platform.descr[d] = descr[d];
				}
			 sio.emit("update", {id: record.id, descr: descr});
			}
		 return this;
		}
};
