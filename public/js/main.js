var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.translate(0.5, 0.5);

var utils = {
    rectRect: function(a, b, c) {
        let distances = [
            (b.y + b.height - a.y),
            (a.y + a.height - b.y),
            (b.x + b.width - a.x),
            (a.x + a.width - b.x)
        ];

        let collision = {};

        for (i = 0; i < 4; i++) {
            if (distances[i] < 0) {
                return false;
            } else if (c) {
                return true;
            }

            if (i == 0 || distances[i] < collision.depth) {
                collision.side = ["top", "bottom", "left", "right"][i];
                collision.depth = distances[i];
            }
        }

        return collision;
    },

    pointRect: function(a, b) {
        return a.x <= b.x && b.x <= a.x + a.width && a.y <= b.y && b.y <= a.y + a.height;
    },

    circleCircle: function(a, b, c) {
        return (b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y) <= a.radius + b.radius;
    }
}

var game = {
    settings: {
        grid: 128
    },
    time: {total: 0, last: 0, delta: 0},
    input: {
        mouse: {x: canvas.width / 2, y: canvas.height / 2},
        keys: {}
    },
    world: [],
    users: [],
    sort: false
}

var camera = new GameObject({
    x: 0,
    y: 0,
    update: function() {
        this.x = player.x,
        this.y = player.y
    }
});

var player = new GameObject({
    x: canvas.width / 2 - 50,
    y: canvas.height / 2 - 50,
    width: 100,
    height: 100,
    radius: 50,
    velocity: {x: 0, y: 0},
    speed: 0.2,
    friction: 15,
    init: function() {
        this.x -= 96;
        this.y -= 96;

        this.lastShot = Date.now() - 300;
    },
    update: function() {
        if (87 in game.input.keys) this.velocity.y += this.speed * game.time.delta;
        if (83 in game.input.keys) this.velocity.y -= this.speed * game.time.delta;
        if (65 in game.input.keys) this.velocity.x += this.speed * game.time.delta;
        if (68 in game.input.keys) this.velocity.x -= this.speed * game.time.delta;

        send({
            type: "PLAYER_UPDATE",
            input: game.input
        });

        this.rotation = Math.atan2(game.input.mouse.y - canvas.height / 2, game.input.mouse.x - canvas.width / 2);

        this.x += this.velocity.x * game.time.delta;
        this.y += this.velocity.y * game.time.delta;

        this.velocity.x -= (this.velocity.x / this.friction) * game.time.delta;
        this.velocity.y -= (this.velocity.y / this.friction) * game.time.delta;

        if (this.velocity.x > -0.01 && this.velocity.x < 0.01) this.velocity.x = 0;
        if (this.velocity.y > -0.01 && this.velocity.y < 0.01) this.velocity.y = 0;

        for (other of game.world) {
            if (other.tags) {
                if (other.tags.includes("solid")) {
                    let a = {x: canvas.width / 2 - this.radius, y: canvas.height / 2 - this.radius, width: this.width, height: this.height};
                    let b = {x: other.x + this.x, y: other.y + this.y, width: other.width, height: other.height};

                    let collision = utils.rectRect(a, b);

                    if (collision) {
                        if (collision.side == "top") {this.velocity.y = 0; this.y -= collision.depth + 0.01}
                        if (collision.side == "bottom") {this.velocity.y = 0; this.y += collision.depth + 0.01}
                        if (collision.side == "left") {this.velocity.x = 0; this.x -= collision.depth + 0.01}
                        if (collision.side == "right") {this.velocity.x = 0; this.x += collision.depth + 0.01}
                    }
                }
            }
        }

        if ((32 in game.input.keys || game.input.mouse.click) && Date.now() - this.lastShot > 300) {
            this.lastShot = Date.now();

            let player = this;

            new GameObject({
                tags: ["bullet"],
                x: canvas.width / 2 - player.x,
                y: canvas.height / 2 - player.y,
                z: -1,
                width: 16,
                height: 16,
                radius: 8,
                velocity: {x: 0, y: 0},
                speed: 5,
                opacity: 1,
                init: function() {
                    this.creation = Date.now();

                    this.rotation = player.rotation;

                    this.x += (player.radius - this.radius * 2) * Math.sin(this.rotation + 1.5708);
                    this.y += (player.radius - this.radius * 2) * Math.cos(this.rotation - 1.5708);

                    this.velocity.x = Math.cos(this.rotation) * this.speed;
                    this.velocity.y = Math.sin(this.rotation) * this.speed;

                    game.sort = true;
                },
                update: function() {
                    for (other of game.world) {
                        if (other.tags && other.tags.includes("solid")) {
                            if (utils.rectRect(this, other, false)) {
                                if (other.health) {
                                    other.health -= 10 / other.durability;
                                }

                                this.destroy = true;
                            }
                        }
                    }

                    this.x += this.velocity.x * game.time.delta;
                    this.y += this.velocity.y * game.time.delta;

                    if (Date.now() - this.creation > 5000) {
                        this.opacity -= game.time.delta / 25;

                        if (this.opacity <= 0) {
                            this.destroy = true;
                        }
                    }
                },
                draw: function() {
                    if (!this.visible) return;

                    ctx.beginPath();
                    ctx.arc(this.x + player.x, this.y + player.y, this.radius, 0, Math.PI * 2);
                    ctx.closePath();
                    ctx.fillStyle = `rgba(255, 255, 0, ${this.opacity})`;
                    ctx.fill();
                }
            });
        }
    },
    draw: function() {
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, this.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = "rgb(0, 0, 255)";
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.lineTo(canvas.width / 2 + this.radius * Math.cos(this.rotation), canvas.height / 2 + this.radius * Math.sin(this.rotation));
        ctx.closePath();
        ctx.strokeStyle = "rgb(0, 0, 0)";
        ctx.stroke();
    }
});

function GameObject(options) {
    for (option in options) {
        this[option] = options[option];
    }

    if (!this.init) this.init = function() {};
    if (!this.update) this.update = function() {};
    if (!this.draw) this.draw = function() {};

    this.init();

    game.world.push(this);
}

function init() {
    window.addEventListener("keydown", function(event) {game.input.keys[event.which] = true});
    window.addEventListener("keyup", function(event) {delete game.input.keys[event.which]});

    window.addEventListener("mousemove", function(event) {
        game.input.mouse.x = event.x;
        game.input.mouse.y = event.y;
    });

    window.addEventListener("mousedown", function(event) {game.input.mouse.click = true});
    window.addEventListener("mouseup", function(event) {game.input.mouse.click = false});

    for (object of game.world) {
        object.init();
    }
}

function loop(time) {
    game.time.total = time;
    game.time.delta = (game.time.total - game.time.last) / (1000 / 60);

    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (game.ws.readyState === 1) {
        if (game.sort) {
            game.sort = false;

            game.world.sort(function(a, b) {
                return (a.z ? a.z : 0) - (b.z ? b.z : 0);
            });

            for (object of game.world) {
                object.visible = true;
            }
        }

        game.users.forEach(user => {
            user.x += user.velocity.x * game.time.delta;
            user.y += user.velocity.y * game.time.delta;

            ctx.beginPath();
            ctx.arc(-user.x + player.x + user.halfwidth, -user.y + player.y + user.halfheight, player.radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fillStyle = "rgb(0, 255, 0)";
            ctx.fill();
        });

        for (object in game.world) {
            if (game.world[object].destroy) {
                game.world.splice(object, 1);
            }
        }

        for (object of game.world) {
            if (game.time.delta < 50) object.update();

            object.draw();
        }
    }

    game.time.last = time;

    requestAnimationFrame(loop);
}

function connect() {
    var ws = new WebSocket(`ws://${window.location.hostname}:8080`);

    ws.onopen = function() {
        console.log("Connected to " + ws.url);

        send({
            type: "CONNECT",
            halfwidth: canvas.width / 2,
            halfheight: canvas.height / 2
        });
    }

    ws.onmessage = function(message) {
        try {
            var data = JSON.parse(message.data);
        } catch {
            return console.log;
        }

        switch (data.type) {
            case "READY":
                console.log("READY", data);

                game.user_id = data.user_id;

                for (row in data.map) {
                    for (col in data.map[row]) {
                        if (data.map[row][col] != 0) {
                            new GameObject({
                                tags: ["solid"],
                                x: row * game.settings.grid,
                                y: col * game.settings.grid,
                                width: game.settings.grid + 1,
                                height: game.settings.grid + 1,
                                init: function() {
                                    this.health = 100;
                                },
                                draw: function() {
                                    ctx.fillStyle = `rgb(255, 255, 255)`;
                                    ctx.fillRect(this.x + player.x, this.y + player.y, this.width, this.height);

                                    ctx.fillStyle = "rgb(255, 0, 0)";
                                    ctx.font = "16px Arial";
                                    ctx.fillText(`${this.health}%`, this.x + player.x, this.y + player.y + 18);
                                }
                            });
                        }
                    }
                }

                init();

                break;
            case "UPDATE":
                // console.log("UPDATE", data);

                game.users = data.users;

                var index = data.users.findIndex(user => user.id === game.user_id);

                var user = data.users[index];

                // player.x = user.x;
                // player.y = user.y;
                // player.velocity = user.velocity;

                game.users.splice(index, 1);
        }
    }

    ws.onclose = function() {
        console.log("Lost connection to " + ws.url);

        game.reconnect = setTimeout(connect, 50);
    }

    game.ws = ws;
}

function send(message) {
    if (game.ws) {
        if (game.ws.readyState == 1) {
            game.ws.send(JSON.stringify(message));
        }
    }
}
