var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var player;
var platforms;
var cursors;
var stars;
var score = 0;
var scoreText;



function preload() {
	game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('rainbow', 'assets/rainbow.png');
    game.load.image('star', 'assets/star.png');
    game.load.image('health', 'assets/health.png');
    game.load.spritesheet('ironman', 'assets/ironman.png', 32, 48);
    game.load.spritesheet('goldbat', 'assets/goldbat.png', 32, 48);
    game.load.spritesheet('magicpot', 'assets/magicpot.png', 32, 48);
    game.load.spritesheet('phoenix', 'assets/phoenix.png', 32, 48);

}

function create() {

	// enable the Arcade Physics system
	game.physics.startSystem(Phaser.Physics.ARCADE);
	// add background sky
	game.add.sprite(0, 0, 'sky');

	// add platform group
	platforms = game.add.group();
	// enable physics for platform
	platforms.enableBody = true;
	// create the ground
	var ground = platforms.create(0, game.world.height - 10, 'ground');
	// Scale ground
	ground.scale.setTo(2,2);
	// stops it from falling away when you jump on it
	ground.body.immovable = true;
	// create ledge
	var ledge = platforms.create( 190, 450, 'rainbow');
	ledge.body.immovable = true;
	// create player
	player = game.add.sprite(32, game.world.height - 150, 'ironman');
	game.physics.arcade.enable(player);
	player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
   	// player animation
    player.animations.add('left', [6, 7, 5, 4], 10, true);
    player.animations.add('right', [10, 11, 9, 8], 10, true);
    player.animations.add('jump', [2], 10, true);
    //  Keyboard inputs
    cursors = game.input.keyboard.createCursorKeys();

   	// create stars
   	stars = game.add.group();
   	stars.enableBody = true;
   	for (var i = 0; i < 160; i+=40){
   		var star = stars.create(i+190, 400, 'star');
   		 star.body.gravity.y = 300;
   		 star.body.bounce.y = 0.7 + Math.random() * 0.2;
   	}

   	// keep Score
   	scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: 'white' });


}

function update() {
	game.physics.arcade.collide(player, platforms);
	game.physics.arcade.collide(stars, platforms);
	game.physics.arcade.overlap(player, stars, collectStar, null, this);

	player.body.velocity.x = 0;
	//  Move to the left
	if (cursors.left.isDown){
        player.body.velocity.x = -150;
        player.animations.play('left');
    }
    //  Move to the left
    else if (cursors.right.isDown){
        player.body.velocity.x = 150;
        player.animations.play('right');
    }
    //  Move to the left
     else if (cursors.up.isDown ){
        player.animations.play('jump');
        if ( player.body.touching.down ){
        	player.body.velocity.y = -350;
        }
    }     
    //  Stand still
    else {
        player.animations.stop();
        player.frame = 0;
    }

}

function collectStar (player, star) {
    
    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;

}


