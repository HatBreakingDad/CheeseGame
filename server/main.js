var WebSocket = require("ws");

var wss = new WebSocket.Server({port: 8080});

wss.on("connection", ws => {
    ws.on("message", message => {
        try {
            var data = JSON.stringify(message);
        } catch {
            return console.log;
        }

        switch (data.type) {
            case "CONNECT":
                console.log("CONNECT", data);

                send

                break;
            case "UPDATE":
                console.log("UPDATE", data);

                // update
        }

        console.log(message);
    });

    ws.on("close", () => {
        if (ws.user_id) {

        }
    });
});

function send(ws, message) {
    ws.send(JSON.stringify(message));
}

function broadcast(message) {
    wss.clients.forEach(ws => {
        if (ws.id) {
            send(ws, message);
        }
    });
}

var time = Date.now();
var last = time;
var game = {
    time: 0,
    last: 0,
    players: {}
}

function update() {
    time = Date.now();
    var delta = time - last;

    // game

    last = Date.now();
}

setInterval(update, 30);
