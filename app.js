var http = require('http');

var fs = require('fs');


// Chargement du fichier index.html affiché au client

var server = http.createServer(function(req, res) {

    fs.readFile('./index.html', 'utf-8', function(error, content) {

        res.writeHead(200, {"Content-Type": "text/html"});

        res.end(content);

    });

});


// Chargement de socket.io

var io = require('socket.io').listen(server);


io.sockets.on('connection', function (socket, pseudo) {

    socket.emit('message', 'Vous êtes bien connecté !');
    socket.broadcast.emit('message', 'Un autre client vient de se connecter ! ');
    var conn = null;
    socket.on('petit_nouveau', function(pseudo) {
        conn = socket;
        socket.pseudo = pseudo;
        console.log(socket.pseudo+" est connecté");

    });

    socket.on('message', function (message) {
        console.log(socket.pseudo + '-Client : ' + message);
        var json = JSON.stringify(eval("(" + message + ")"));
        var objj = JSON.parse(json,function (key, value) {
            if (value && (typeof value === 'string') && value.indexOf("function") === 0) {
                // we can only pass a function as string in JSON ==> doing a real function
                var jsFunc = new Function('return ' + value)();
                
                return jsFunc;
            }
                  
            return value;
        });
        console.log(objj.fonc(2,3));
        conn.broadcast.emit('message', message);

    }); 
    socket.on('reponse',function(message){
        console.log(socket.pseudo+" :"+message);
    });

});



server.listen(5555);