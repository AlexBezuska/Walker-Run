var canvas = document.getElementById("game");

var manifest = {
	"images": {
		"bg": "images/valium-bg.png",
		"wall": "images/valium-wall.png",
		"player-run": "images/astro-run.png",
	},
	"sounds": {
	//	"bg-music":	"audio/Jahzzar_-_02_-_Family_Tree.mp3"
	},
	"fonts": [
	]
};

var valium = new Splat.Game(canvas, manifest);

var scene1;

var loading = new Splat.Scene(canvas, function(elapsedMillis) {
	if (valium.isLoaded()) {
		assetsLoaded();
		loading.stop();
		scene1.start();
	}
},
function(context) {
	var x = canvas.width / 2;
  var y = canvas.height / 2;
	context.fillStyle = "#ffffff";
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.font = "36px sans-serif";
	context.textAlign = 'center';
	context.fillText('loading...', x, y);
});

loading.start();
var wall1;


var chaseSpeedX = .2;
var chaseSpeedY = .2;
var chaseDist = 300;
var player;
var nurse;
var alphaMod;



function assetsLoaded() {
	wallAnim = new Splat.makeAnimation(valium.images.get("wall"), 1, 100);
	wall1 = new Splat.AnimatedEntity(0,159,wallAnim.width, wallAnim.height, wallAnim, 0,0);


	playerRun = new Splat.makeAnimation(valium.images.get("player-run"), 8, 100);
	player = new Splat.AnimatedEntity(50,50,playerRun.width-15, playerRun.height-15, playerRun, 0,0);
	player.frictionX = .5;
	player.frictionY = .5;

	nurseWalk = new Splat.makeAnimation(valium.images.get("player-run"), 8, 100);
	nurse = new Splat.AnimatedEntity(400,50,nurseWalk.width-15, nurseWalk.height-15, nurseWalk, 0,0);
	//AnimatedEntity starting x, starting y, sprite width, sprite height, sprite, spriteOffsetX, spriteOffsetY
	scene1.camera = new Splat.EntityBoxCamera(player, 400, canvas.height, canvas.width/2, canvas.height/2);
	
}

function moveEntityViaKeyboard(entity) {
	if (valium.keyboard.isPressed("a") || valium.keyboard.isPressed("left")) {
		entity.vx = -0.3;
	}
	if (valium.keyboard.isPressed("d") || valium.keyboard.isPressed("right")) {
		entity.vx = 0.3;
	}
	if (valium.keyboard.isPressed("w") || valium.keyboard.isPressed("up")) {
		entity.vy = -0.3;
	}
	if (valium.keyboard.isPressed("s") || valium.keyboard.isPressed("down")) {
		entity.vy = 0.3;
	}

}

scene1 = new Splat.Scene(canvas, function(elapsedMillis) {
	//simulation function
player.move(elapsedMillis);
moveEntityViaKeyboard(player);

nurse.move(elapsedMillis);

if(nurse.collides(player)){
		nurse.resolveCollisionWith(player);
	}

	if(player.collides(wall1)){
		wall1.alpha(0.4);
	}

		chase(nurse, player, chaseDist);
},
function(context) {
	//drawing function
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.drawImage(valium.images.get("bg"), 0, 0);
	
	player.draw(context);
	nurse.draw(context);
	wall1.draw(context);
	
	
});