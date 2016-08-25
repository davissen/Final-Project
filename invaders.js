var game = new Phaser.Game(800, 650, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update});

var player;
var lives;
var cursors;
var starfield;
var score = 0;
var scoreString = '';
var scoreText;
var bullets;
var bulletTime = 0;
var cursors;
var fireButton;
var firingTimer = 0;
var stateText;
var aliens;
var fireButton;
var explosions;
var scoreText;
var enemyBullet;
var livingEnemies = [];

function preload() {

    game.load.spritesheet('bullet', 'assets/blast.png');
    game.load.image('enemyBullet', 'assets/enemy-bullet.png');
    game.load.spritesheet('invader', 'assets/invader32x32x4.png', 32, 32);
    game.load.image('ship', 'assets/ship.png');
    game.load.spritesheet('kaboom', 'assets/explode.png', 128, 128);
    game.load.image('starfield', 'assets/background.png');
    game.load.image('lives', 'assets/lives.png');

}

function create() {

    // create background
    game.physics.startSystem(Phaser.Physics.ARCADE);
    starfield = game.add.tileSprite(0, 0, 800, 650, 'starfield');

    // create player
    player = game.add.sprite(400, 590, 'ship');
    player.anchor.setTo(0.5, 0.5);
    game.physics.enable(player, Phaser.Physics.ARCADE);

    cursors = game.input.keyboard.createCursorKeys();

    //  Player weapon
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);
    // bullets.callAll('animations.add', 'animations', 'fire', [0,1,2,3,4,5,6], 5, true);
    // bullets.callAll('play', null, 'fire');
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    //  Lives
    lives = game.add.group();
    game.add.text(game.world.width - 100, 10, 'Lives : ', { font: '20px Perpetua', fill: '#fff' });
    for (var i = 0; i < 3; i++) 
    {
        var ship = lives.create(game.world.width - 100 + (40 * i), 50, 'lives');
        ship.anchor.setTo(0.5, 0.5);
        ship.alpha = 0.5;
    }

    //  The score
    scoreString = 'Score : ';
    scoreText = game.add.text(10, 10, scoreString + score, { font: '20px Perpetua', fill: '#fff' });

    //  Text
    stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Perpetua', fill: '#fff' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;

    aliens = game.add.group();
    aliens.enableBody = true;
    aliens.physicsBodyType = Phaser.Physics.ARCADE;
    createAliens();

    // The enemy's bullets
    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(30, 'enemyBullet');
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 1);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);


}


function setupInvader (invader) {



}



function update() {

    //  The scrolling starfield background
    starfield.tilePosition.y += 2;

    // move player 

        if (cursors.left.isDown)
        {
            player.body.velocity.x = -200;
        }
        else if (cursors.right.isDown)
        {
            player.body.velocity.x = 200;

        }
    // fire bullets
    if (fireButton.isDown)
    {
        // bullet.animations.play('fire')
        fireBullet();
    }

    if (game.time.now > firingTimer)
    {
        enemyFires();
    }

    game.physics.arcade.overlap(bullets, aliens, collisionHandler, null, this);
    game.physics.arcade.overlap(enemyBullets, player, enemyHitsPlayer, null, this);
    

}

function fireBullet () {
    
    //  To avoid them being allowed to fire too fast we set a time limit
    if (game.time.now > bulletTime)
    {
        //  Grab the first bullet we can from the pool
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            //  And fire it

            bullet.reset(player.x, player.y + 8);
            bullet.body.velocity.y = -400;
            bulletTime = game.time.now + 200;
        }
    }


}

function createAliens () {

    for (var y = 0; y < 4; y++)
    {
        for (var x = 0; x < 10; x++)
        {
            var alien = aliens.create(x * 43, y * 50, 'invader');
            alien.anchor.setTo(0.5, 0.5);
            alien.body.moves = false;
        }
    }

    aliens.x = 110;
    aliens.y = 15;

    //   Invaders left/right motion
    var tween = game.add.tween(aliens).to( { x: 280 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

    //  When the tween loops it calls descend
    // tween.onLoop = function(){
    //     aliens.y += 10;
    // }

}

// function descend() {

// }



function collisionHandler (bullet, alien) {

    // kill bullet and alien
    bullet.kill();
    alien.kill();
    //  Increase the score
    score += 20;
    scoreText.text = scoreString + score;


}


function enemyFires () {

    //  Grab the first bullet we can from the pool
    enemyBullet = enemyBullets.getFirstExists(false);

    livingEnemies.length=0;

    aliens.forEachAlive(function(alien){

        // put every living enemy in an array
        livingEnemies.push(alien);
    });
      if (enemyBullet && livingEnemies.length > 0)
    {
        
        var random=game.rnd.integerInRange(0,livingEnemies.length-1);

        // randomly select one of them
        var shooter=livingEnemies[random];
        // And fire the bullet from this enemy
        enemyBullet.reset(shooter.body.x, shooter.body.y);

        game.physics.arcade.moveToObject(enemyBullet,player,120);
        firingTimer = game.time.now + 2000;
    }

}

function enemyHitsPlayer (player,bullet) {
    bullet.kill();

    live = lives.getFirstAlive();

    if (live)
    {
        live.kill();
    }



}


function resetBullet (bullet) {



}

function restart () {


}