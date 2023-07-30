let player = new Player()
let interfaces = new Interface()

function handleMouseMove(e, element) {
    e.preventDefault();
    e.stopPropagation();
    let mouseX = parseInt(e.clientX - offsetX);
    let mouseY = parseInt(e.clientY - offsetY);

    let dx = mouseX - (innerWidth - canvas.width) * 0.5
    let dy = mouseY - (innerHeight - canvas.height) * 0.5
    let isInside = dx > element.position.x && dx < element.position.x + element.width
        && dy > element.position.y && dy < element.position.y + element.height
    
    if (isInside) {
        element.hover = true
    } else {
        element.hover = false
    }
}

function mouseClick(e, element){
    if(!game.pause) return
    e.preventDefault();
    e.stopPropagation();

    let mouseX = parseInt(e.clientX - (innerWidth - canvas.width) * 0.5);
    let mouseY = parseInt(e.clientY - (innerHeight - canvas.height) * 0.5);

    if(mouseX > element.position.x && mouseX < element.position.x + element.width
        && mouseY > element.position.y && mouseY < element.position.y + element.height)
    element.Utility()
}

function restoreWalls(){

    for(let i = 10; i < (canvas.width - canvas.width * 0.125)/5; i++){ 
        
        if((i/10) % 2 ==0) i+= 30
        for (let j = 0; j < 5; j++) {
            walls.push(new Walls({
                position:{
                    x: canvas.width * 0 + i * 5,
                    y: canvas.height * 0.7 + j * 5
                }
            }))
            
        }
        
    }
}

restoreWalls()

btns.push(new Btns({
    position:{
        x: canvas.width * 0.4,
        y: canvas.height * 0.35
    },
    width: canvas.width * 0.2,
    height: 50,
    text: "Continuar",
    color: "#ffffff",
    hoverColor: "#888888",
    type: 1
}))

btns.push(new Btns({
    position:{
        x: canvas.width * 0.4,
        y: canvas.height * 0.5
    },
    width: canvas.width * 0.2,
    height: 50,
    text: "Reiniciar",
    color: "#ff0055",
    hoverColor: "#ff2244",
    type: 2
}))

//npcs.push(new Enemy({position:{x:50,y:50},type:2}))





for(let i = 0; i < 100; i++){
    let radio = Math.random()*3
    stars.push(new Star({
        position:{
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height
        },
        velocity:{
            x: 0,
            y: radio/5
        },
        radius: radio,
        
    }))
    
}

function CreateParticles({object, color}){
    for(let i = 0; i < 15; i++){
        
        particles.push(new Particle({
            position:{
                x: object.position.x + object.width / 2 || object.position.x,
                y: object.position.y + object.height / 2 || object.position.y
            },
            velocity:{
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            },
            radius: Math.random() * 3,
            color: color || 'white'
        }))
    }
}

function Animate() {
    if(!game.active) return
    
    requestAnimationFrame(Animate)
    persp.fillStyle = '#101030'
    persp.fillRect(0, 0, canvas.width, canvas.height)
    

    if(game.pause) {

        interfaces.Draw()

        btns.forEach(btn => {
            btn.Draw()
        });

        return
    }

    player.Update()

    stars.forEach((star, starIndex) => {
        if(star.position.y - star.radius >= canvas.height){
            star.position.x = Math.random() * canvas.width
            star.position.y = -star.radius
        }
        
            star.Update()
        
    });

    particles.forEach((particle, particleIndex) => {
        if(particle.opacity <= 0){
            setTimeout(() => {
                particles.splice(particleIndex, 1)
            }, 0);
        }
        else{
            particle.Update()
        }
    });
    

    enemyBullets.forEach((enemyBullet, enemyBulletIndex) => {
        if(enemyBullet.position.y + enemyBullet.height >= canvas.height){
            setTimeout(() => {
                enemyBullets.splice(enemyBulletIndex, 1)
            }, 0);
        }
        else{
            enemyBullet.Update()
        }

        // Bullets hit player
        if(enemyBullet.position.y + enemyBullet.height >= player.position.y
            && enemyBullet.position.y <= player.position.y + player.height
            && enemyBullet.position.x + enemyBullet.width >= player.position.x
            && enemyBullet.position.x <= player.position.x + player.width){

                

                setTimeout(() => {
                    
                    player.Hurt(enemyBullet.damage, enemyBullet.velocity.x * 0.5, enemyBullet.velocity.y * 0.5)
                    
                    enemyBullets.splice(enemyBulletIndex, 1)
                    
                    //LOSE CONDITION
                    if(player.hp <= 0){
                        player.opacity = 0
                        game.over = true
                    }
                }, 0);

                setTimeout(() => {
                    if(player.hp <= 0)
                        game.active = false
                }, 2000);

                
                    CreateParticles({
                        object: player,
                        color: 'red'
                    })
                    
                
        }
    })

    bullets.forEach((bullet, index) => {
        if(bullet.position.y + bullet.radius <= 0) {
            setTimeout(() => {
                bullets.splice(index, 1)
            }, 0)
            
        } else{
            bullet.Update()
        }
    });

    infos.forEach((info, index) => {
        if(info.position.y <= 0 || info.opacity <= 0) {
            setTimeout(() => {
                infos.splice(index, 1)
            }, 0)
            
        } else{
            info.Update()
        }
    });

    drops.forEach((drop, index) => {
        if(drop.position.y + drop.radius <= 0) {
            setTimeout(() => {
                drops.splice(index, 1)
            }, 0)
            
        } else{
            drop.Update()
        }

        if(Math.sqrt(Math.pow(drop.position.x + drop.width * 0.5 - player.position.x - player.width * 0.5, 2) 
        + Math.pow(drop.position.y + drop.height * 0.5 - player.position.y - player.height * 0.5, 2)) < player.width * 0.5){

            drop.Catched()

            infos.push(new Info({position:{
                x: player.position.x,
                y: player.position.y
            },
            velocity:{
                x: 0,
                y: -1
            },
            text: drop.info
            }))


            drops.splice(index, 1)
        }

    });


    grids.forEach((grid, gridIndex) =>{
        grid.Update()

        if(grid.enemies.length === 0) grids.splice(grids.indexOf(grid),1)

        //Enemies shoots
        
        if(frames % randomTimeShoot == 0 && grid.enemies.length > 0){
            grid.enemies[Math.floor(Math.random() * grid.enemies.length)].Shoot()
            randomTimeShoot = Math.floor(Math.random())*20 + 90
        }

        grid.enemies.forEach((enemy, i) =>{
            enemy.Update({velocity: grid.velocity})

            

            //Player hits enemies
            if(enemy.position != null)
            if(Math.sqrt(Math.pow(player.position.x - enemy.position.x, 2) + Math.pow(player.position.y - enemy.position.y, 2)) <
             player.width * 0.4 + enemy.width * 0.4 && !game.over){
                
                player.Hurt(enemy.attack, enemy.velocity.x - player.velocity.x, enemy.velocity.y - player.velocity.y)

                
                    
                

                setTimeout(() => {
                    const enemyFound = grid.enemies.find(founded =>{
                        return founded === enemy
                    })

                    if(enemyFound)
                    enemyFound.Hurt(player.attack)
                    
                    if(enemyFound.hp <= 0){

                        
                        if(enemyFound){

                                
                                
                            grid.enemies.splice(i, 1)
                            

                            if(grid.enemies.length > 0){
                                const firstEnemy = grid.enemies[0]
                                const lastEnemy = grid.enemies[grid.enemies.length - 1]

                                grid.width = lastEnemy.position.x - firstEnemy.position.x + lastEnemy.width
                                grid.position.x = firstEnemy.position.x
                            }
                            else{
                                grids.splice(gridIndex, 1)
                            }
                        }

                    }
                    
                    }, 0)
                
            }

            bullets.forEach((bullet, j) => {
                
                // Bullets hit enemies
                if(enemy.position != null)
                if(bullet.position.y - bullet.radius <= enemy.position.y + enemy.height
                    && bullet.position.x + bullet.radius >= enemy.position.x
                    && bullet.position.x - bullet.radius <= enemy.position.x + enemy.width
                    && bullet.position.y + bullet.radius - bullet.velocity.y >= enemy.position.y){

                        

                        setTimeout(() => {
                            const enemyFound = grid.enemies.find(founded =>{
                                return founded === enemy
                            })

                            const bulletFound = bullets.find(holyBullet => {
                                return holyBullet === bullet
                            })

                            BulletHit(bulletFound, enemyFound)
                            
                            if(enemyFound && bulletFound){
                                if(enemyFound.hp <= 0){

                                

                                    
                                    grid.enemies.splice(i, 1)
                                    

                                    if(grid.enemies.length > 0){
                                        const firstEnemy = grid.enemies[0]
                                        const lastEnemy = grid.enemies[grid.enemies.length - 1]

                                        grid.width = lastEnemy.position.x - firstEnemy.position.x + lastEnemy.width
                                        grid.position.x = firstEnemy.position.x
                                    }
                                    else{
                                        grids.splice(gridIndex, 1)
                                    }
                                }

                            }
                            
                            }, 0)
                        
                }
            })
            if(!npcs.includes(enemy)) grid.enemies.splice(i, 1)
        })
    })

    npcs.forEach((npc, index) => {
        
        if(npc.type != 1){

            if(frames % randomTimeShoot == 0){
                let randomNpc = Math.floor(Math.random() * npcs.length)
                if(npc.position != null)
                npc.Shoot()
                randomTimeShoot = Math.floor(Math.random())*20 + 90
            }

            npc.Update({velocity:{x:0,y:0}})
            if(player.position != null && npc.position != null)
            if(Math.sqrt(Math.pow(player.position.x - npc.position.x, 2) + Math.pow(player.position.y - npc.position.y, 2)) <
             player.width * 0.4 + npc.width * 0.4 && !game.over){
                
                player.Hurt(npc.attack, npc.velocity.x - player.velocity.x, npc.velocity.y - player.velocity.y)
                npc.Hurt(player.attack)
             }

            bullets.forEach((bullet, index) => {
                if(Distance(npc.position.x + npc.width * 0.5, bullet.position.x, npc.position.y + npc.height * 0.5, bullet.position.y) < 60){
                    //npc.Hurt(bullet.damage)
                    BulletHit(bullet, npc)
                }
            });
        }
        if(npc.hp <= 0){
            npcs.splice(index, 1)
        }
    });

    walls.forEach(wall => {
        wall.Update()
    });

    if(keys.dash.pressed){ 
        
        if(!player.dash) player.Dash()
        
    }
    else{
        if(player.dashVelocity == 0) {
            player.dash = false
        }
    }

    if(keys.a.pressed && player.position.x >= 0 || keys.arrowLeft.pressed && player.position.x >= 0) {
        if(Math.abs( player.velocity.x) <= player.velocityMagnitude)
            player.velocity.x -= 0.5
        player.rotation -= 0.05
    }
    else if (keys.d.pressed && player.position.x + player.width <= canvas.width || keys.arrowRight.pressed && player.position.x + player.width <= canvas.width){
        if(Math.abs( player.velocity.x) <= player.velocityMagnitude)
            player.velocity.x += 0.5
        player.rotation += 0.05
    }
    else{
        //player.velocity.x = 0
        //player.rotation = 0
    }

    if(keys.w.pressed && player.position.y >= 0 || keys.arrowUp.pressed && player.position.y >= 0){
        if(Math.abs( player.velocity.y) <= player.velocityMagnitude)
            player.velocity.y -= 0.5
    }
    else if (keys.s.pressed && player.position.y + player.height <= canvas.height || keys.arrowDown.pressed && player.position.y + player.height <= canvas.height){
        if(Math.abs( player.velocity.y) <= player.velocityMagnitude)
            player.velocity.y += 0.5
    }
    else{
        //player.velocity.y = 0
    }

    if(keys.space.pressed){
        
        
        if(!player.cooldown){
            Shooting()
            //audioShoot.pause()
            audioShoot.currentTime = 0
            audioShoot.play()
            setTimeout(() => {
                player.cooldown = false
            }, 1000/player.speedAttack);
        }
        
        
    }else{
        interval = null
    }

    //Spawn enemies
    if(frames % randomSeed == 0 || npcs.length == 0){
        if(Math.random() > 0.5){
            grids.push(new Grid())
        }
        else{
            npcs.push(new Enemy({position:{x:Math.random() * canvas.width, y:-50}, type:2}))
        }

        randomSeed = Math.floor((Math.random() * 1000) + 1000 - frames * 0.1)

        
    }

    frames++
}

function BulletHit(bullet, shooted){
    //setTimeout(() => {

        let extraDamage = 0
        if(Math.random() < player.critical * player.lucky){
            extraDamage = player.attack * player.criticalDamage
        }
        if(shooted && bullet)
            shooted.Hurt(bullet.damage + extraDamage, bullet.velocity.x * bullet.radius / 10, bullet.velocity.y * bullet.radius / 10)
        else if (shooted)
            shooted.Hurt(player.damage + extraDamage)
        
        if(bullets.includes(bullet))
            bullets.splice(bullets.indexOf(bullet), 1)
    //}, 0)
}

function Shooting(){
    bullets.push(new Bullet({
                
        position:{
            x: player.position.x + player.width * 0.5, y: player.position.y
        },
        velocity:{
            x: 0, y: -player.bulletSpeed
        },
        radius: player.bulletSize,
        damage: player.attack,
        color: player.bulletColor
    }))

    player.cooldown = true
}

Animate()

addEventListener('keydown', ({key}) =>{
if(game.over) return

    switch(key){
        case 'a':
            keys.a.pressed = true;
        break;
            
        case 'w':
            keys.w.pressed = true;
        break;

        case 'd':
            keys.d.pressed = true;
        break;

        case 's':
            keys.s.pressed = true;
        break;

        case 'ArrowLeft':
            keys.arrowLeft.pressed = true;
        break;
            
        case 'ArrowUp':
            keys.arrowUp.pressed = true;
        break;

        case 'ArrowRight':
            keys.arrowRight.pressed = true;
        break;

        case 'ArrowDown':
            keys.arrowDown.pressed = true;
        break;

        case ' ':
            keys.space.pressed = true;
            
        break;
        case 'c':
            keys.dash.pressed = true;
        break;
        case 'Escape':
            game.pause = !game.pause
            //game.active = !game.active
        break;
        case 'm':
            if(volume == 1){
                volume = 0
                audioBullet2Bullet.volume = 0
                audioDamage.volume = 0
                audioPower.volume = 0
                audioShoot.volume = 0
            }else{
                volume = 1
                audioBullet2Bullet.volume = 1
                audioDamage.volume = 1
                audioPower.volume = 1
                audioShoot.volume = 1
            }
        break;
    }
})

addEventListener('keyup', ({key}) =>{
    switch(key){
        case 'a':
            keys.a.pressed = false;
        break;
            
        case 'w':
            keys.w.pressed = false;
        break;

        case 'd':
            keys.d.pressed = false;
        break;

        case 's':
            keys.s.pressed = false;
        break;

        case 'ArrowLeft':
            keys.arrowLeft.pressed = false;
        break;
            
        case 'ArrowUp':
            keys.arrowUp.pressed = false;
        break;

        case 'ArrowRight':
            keys.arrowRight.pressed = false;
        break;

        case 'ArrowDown':
            keys.arrowDown.pressed = false;
        break;

        case ' ':
            keys.space.pressed = false;
        break;

        case 'c':
            keys.dash.pressed = false;
        break;
    
    }
})

addEventListener('mousemove', (event) => {handleMouseMove(event, btns[0])});
addEventListener('click', (event) => {mouseClick(event, btns[0])})

addEventListener('mousemove', (event) => {handleMouseMove(event, btns[1])});
addEventListener('click', (event) => {mouseClick(event, btns[1])})