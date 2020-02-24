var width = 800;
var height = 800;

var game = new Phaser.Game(width, height, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });
var player;
var bg;
var map_size = 400;
var balls;
var player_size = 1;
var moveBullets;
var colors = ["yellow", "blue", "orange", "pink", "green", "red"];
var minSpeed = 500;


this.game.scale.pageAlignHorizontally = true;
this.game.scale.pageAlignVertically = true;
this.game.scale.refresh();

function preload() {
    game.load.image('background', 'img/grid.png');
}

function create() {


    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.time.advancedTiming = true;
    game.time.desiredFps = 60; //fps
    game.time.slowMotion = 2.0;

    bg = game.add.tileSprite(0, 0, map_size, map_size, 'background');
    game.world.setBounds(0, 0, map_size, map_size);
    game.stage.backgroundColor = "#fff";

    balls = game.add.group();
    balls.enableBody = true;
    for (var i = 0; i < 500; i++) {
        var rand = Math.floor(Math.random() * 4);
        var bounces = generateCircle(colors[rand], 10);
        var ball = balls.create(game.world.randomX, game.world.randomY, bounces);
    }

    setInterval(function() {
        for (var i = 0; i < 30; i++) {
            var rand = Math.floor(Math.random() * 5);
            var bounces = generateCircle(colors[rand], 10);
            var ball = balls.create(game.world.randomX, game.world.randomY, bounces);
        }
    }, 9000);

    var bmd = generateCircle('black', 20);

    player = game.add.sprite(game.world.centerX, game.world.centerY, bmd);
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.anchor.setTo(0.5, 0.5);
    game.camera.follow(player);
    player.body.collideWorldBounds = false;
}

function update() {
    game.input.addMoveCallback(function() {
    game.physics.arcade.moveToPointer(player, minSpeed);
    });
    game.physics.arcade.collide(player, balls, collisionHandler, processHandler, this);

    if (player.body.x > map_size - (player_size / 2)) {
	var pos1 = player.body.y + (player_size / 2);
        player.reset(0, pos1);
    }
    if (player.body.x < -100) {
	var pos2 = player.body.y + (player_size / 2);
        player.reset(map_size - (player_size / 2), pos2);
    }
    if (player.body.y > map_size - (player_size / 2)) {
        var pos3 = player.body.x;
        player.reset(pos3, 0);
    }
    if (player.body.y < -100) {
        var pos4 = player.body.x;
        player.reset(pos4, map_size - (player_size / 2));
    }
}

function generateCircle(color, size) {
    var bitmapSize = size * 2;
    var bmd = this.game.add.bitmapData(bitmapSize, bitmapSize);
    bmd.ctx.fillStyle = color;
    bmd.ctx.beginPath();
    bmd.ctx.arc(size, size, size, 0, Math.PI * 2, true);
    bmd.ctx.closePath();
    bmd.ctx.fill();
    return bmd;
}

function processHandler(player, ball) {
    return true;
}

function collisionHandler(player, ball) {
    ball.kill();
    player_size++;
    if (minSpeed > 100) {
        minSpeed = minSpeed - 1;
    }
    player.scale.set(1 + player_size / 5 / 14);
    game.physics.arcade.moveToPointer(player, minSpeed);
}