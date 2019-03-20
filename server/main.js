var WebSocket = require("ws");

var wss = new WebSocket.Server({port: 8080});

var game = {
    time: 0,
    last: 0,
    users: []
};

wss.on("connection", ws => {
    ws.on("message", message => {
        try {
            var data = JSON.parse(message);
        } catch {
            return console.log;
        }

        switch (data.type) {
            case "CONNECT":
                console.log("CONNECT", data);

                game.users.push({
                    // x: 0,
                    // y: 0,
                    // width: 100,
                    // height: 100,
                    // radius: 50,
                    // stats: {
                    //     kills: 0,
                    //     deaths: 0
                    // },
                    // speed: 0.2,
                    // friction: 1

                    id: game.users.length,
                    x: 0,
                    y: 0,

                    stats: {
                        kills: 0,
                        deaths: 0
                    }
                });

                send(ws, {
                    type: "CONNECTED",
                    user_id: game.users.length - 1,
                    users: game.users
                });

                ws.user_id = game.users.length - 1;

                break;
            case "UPDATE":
                // console.log("UPDATE", data);

                var id = ws.user_id;

                if (id === undefined) return;
                if (game.users[id] === undefined) return;

                game.users[id].x = data.x;
                game.users[id].y = data.y;
                game.users[id].velocity = data.velocity;
                game.users[id].halfwidth = data.halfwidth;
                game.users[id].halfheight = data.halfheight;
        }
    });

    ws.on("close", () => {
        if (ws.user_id !== undefined) {
            // game.users.splice(ws.user_id);

            game.users[ws.user_id] = {};
        }
    });
});

function send(ws, message) {
    ws.send(JSON.stringify(message));
}

function update() {
    game.time = Date.now();
    var delta = game.time - game.last;

    wss.clients.forEach(ws => {
        if (ws.user_id !== undefined) {
            if (ws.readyState === 1) {
                send(ws, {
                    type: "UPDATE",
                    user_id: ws.user_id,
                    users: game.users
                });
            }
        }
    });

    game.last = Date.now();
}

setInterval(update, 30);
