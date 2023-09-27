var bulletTime1 = 0;

var bullet_player1_material = new THREE.MeshLambertMaterial(
{
    color: 0x00ff00, 
    transparent: false
});

function shoot()
{
    if (keyboard.pressed("space") && bulletTime1 + 0.8 < clock.getElapsedTime())
    {
        bullet = new THREE.Mesh(
            new THREE.SphereGeometry(2),
            bullet_player1_material);
        scene.add(bullet);
        bullet.position.x = player1.graphic.position.x + 7.5 * Math.cos(player1.direction);
        bullet.position.y = player1.graphic.position.y + 7.5 * Math.sin(player1.direction);
        bullet.angle = player1.direction;
        player1.bullets.push(bullet);
        bulletTime1 = clock.getElapsedTime();
    } 

    // move bullets
    var moveDistance = 5;

    for (var i = 0; i < player1.bullets.length; i++)
    {
        player1.bullets[i].position.x += moveDistance * Math.cos(player1.bullets[i].angle);
        player1.bullets[i].position.y += moveDistance * Math.sin(player1.bullets[i].angle);

        // collision between bullet and enemy
        if (Math.abs(player1.bullets[i].position.x - enemy1.graphic.position.x) <= 10 &&
            Math.abs(player1.bullets[i].position.y - enemy1.graphic.position.y) <= 10)
        {
            scene.remove(enemy1.graphic);
            enemy1.alive = false;
            enemy1.dead();
            scene.remove(player1.bullets[i]);
            player1.bullets.splice(i, 1);
            i--;
            continue;
        }

        if (Math.abs(player1.bullets[i].position.x - enemy2.graphic.position.x) <= 10 &&
            Math.abs(player1.bullets[i].position.y - enemy2.graphic.position.y) <= 10)
        {
            scene.remove(enemy2.graphic);
            enemy2.alive = false;
            enemy2.dead();
            scene.remove(player1.bullets[i]);
            player1.bullets.splice(i, 1);
            i--;
            continue;
        }
    }

}

function collisions()
{
    bullet_collision();
    player_collision();
    player_falling();
}

function bullet_collision()
{
    //collision between bullet and walls
    for (var i = 0; i < player1.bullets.length; i++)
    {
        if (Math.abs(player1.bullets[i].position.x) >= WIDTH / 2 ||
            Math.abs(player1.bullets[i].position.y) >= HEIGHT / 2)
        {
            scene.remove(player1.bullets[i]);
            player1.bullets.splice(i, 1);
            i--;
        }
    }

}

function player_collision()
{
    //collision between player and walls
    var x = player1.graphic.position.x + WIDTH / 2;
    var y = player1.graphic.position.y + HEIGHT / 2;

    if ( x > WIDTH )
        player1.graphic.position.x -= x - WIDTH;
    if ( x < 0 )
        player1.graphic.position.x -= x;
    if ( y < 0 )
        player1.graphic.position.y -= y;
    if ( y > HEIGHT )
        player1.graphic.position.y -= y - HEIGHT;

}

function player_falling()
{
    var nb_tile = 10;
    var sizeOfTileX = WIDTH / nb_tile;
    var sizeOfTileY = HEIGHT / nb_tile;
    var x = player1.graphic.position.x | 0;
    var y = player1.graphic.position.y | 0;
    var xEnemy = enemy1.graphic.position.x | 0;
    var yEnemy = enemy1.graphic.position.y | 0;
    var length = noGround.length;
    var element = null;

    for (var i = 0; i < length; i++) {
        element = noGround[i];

        var tileX = (element[0]) | 0;
        var tileY = (element[1]) | 0;
        var mtileX = (element[0] + sizeOfTileX) | 0;
        var mtileY = (element[1] + sizeOfTileY) | 0;

        if ((Math.abs(x - xEnemy) <= 20)
            && (Math.abs(y - yEnemy) <= 20))
        {
            player1.life--;
            // tp player to start
            player1.graphic.position.x = 150;
            player1.graphic.position.y = 0;
            console.log(player1.life);
        }

        if (player1.life == 0)
        {
            player1.dead();
            break;
        }

        if ((x >= tileX)
            && (x <= mtileX)
            && (y >= tileY) 
            && (y <= mtileY))
        {
            player1.dead();
            break;
        }
    }
}
