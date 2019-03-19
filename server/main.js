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
                console.log("AUTH", data);



                break;
            case "UPDATE":
                console.log("PLAYER_UPDATE", data);
        }

        console.log(message);
    });

    ws.on("close", () => {
        if (ws.user_id) {

        }
    });
});
