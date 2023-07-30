class Player {
    constructor(){
        

        this.velocity ={
            x: 0, y: 0
        }

        this.rotation = 0

        this.scale = 0.5

        this.opacity = 1

        this.speedAttack = 3

        this.velocityMagnitude = 3

        this.bulletSize = 3

        this.hp = 100

        this.hpMax = 100

        this.attack = 60

        this.cooldown = false

        this.damaged = false

        this.bulletSpeed = 5

        this.bulletColor = '#ffffff'

        this.actualHealt = 100

        this.lucky = 1

        this.critical = 0.1

        this.criticalDamage = 2
        this.actualScale = 0.5

        this.dashCooldown = 150
        this.dash = false
        this.dashVelocity = 0


        const image = new Image()
        image.src = './nave.png'
        image.onload = () => {
            this.image = image
            this.width = image.width * this.scale
            this.height = image.height * this.scale

            this.position = {
                x: canvas.width / 2 - this.width * this.scale,
                y: canvas.height * 0.9 - this.height
            }
        }

    }

    Scaled(newScale){
        let helpScale = this.scale
        this.scale = newScale
        this.width *= this.scale / helpScale
        this.height *= this.scale / helpScale
        this.position.x -= (this.scale - helpScale) * this.width * 0.5
        this.position.y -= (this.scale - helpScale) * this.height / 2
    }

    
    
    Dash() {
        if(!this.dash){
            
            const cooldown = this.dashCooldown
            this.dash = true
            
            this.dashVelocity = 10
            
            setTimeout(() => {
                this.dashVelocity = 0.01
                setTimeout(() => {
                    this.dashVelocity = 0
                }, cooldown * 3);
                
            }, cooldown);
        }
    }

    Hurt(damage, x, y){
        if(x)
        this.velocity.x += x
        if(y)
        this.velocity.y += y

        this.hp -= damage
        this.damaged = true
        //audioDamage.pause()
        audioDamage.currentTime = 0
        audioDamage.play()
        audioBullet2Bullet.currentTime = 0
        audioBullet2Bullet.play()
        this.rotation = (Math.random() * 3) - 1.5
        
        window.clearTimeout(hurting)
        hurting = null
        hurting = setTimeout(() => {
            this.damaged = false
            
        }, 250);

        if(player.hp <= 0){
            player.opacity = 0
            game.over = true
        }

        setTimeout(() => {
            if(player.hp <= 0)
                game.active = false
        }, 2000);

        
            CreateParticles({
                object: this,
                color: 'red'
            })

        if(hurtingScale == null){
        
            persp.translate(player.position.x + player.width / 2, player.position.y + player.height / 2)
            persp.rotate(0.02)
            persp.scale(20/19, 20/19)
            persp.translate(-(player.position.x + player.width / 2), -(player.position.y + player.height / 2))
            hurtingScale = setTimeout(() => {
                persp.translate(player.position.x + player.width / 2, player.position.y + player.height / 2)
                persp.rotate(-0.02)
                persp.scale(19/20, 19/20)
                persp.translate(-(player.position.x + player.width / 2), -(player.position.y + player.height / 2))
                persp.setTransform(1, 0, 0, 1, 0, 0);
                hurtingScale = null
            }, 50);
        } else{
            window.clearTimeout(hurtingScale)
            hurtingScale = null
            hurtingScale = setTimeout(() => {
                persp.translate(player.position.x + player.width / 2, player.position.y + player.height / 2)
                persp.rotate(-0.02)
                persp.scale(19/20, 19/20)
                persp.translate(-(player.position.x + player.width / 2), -(player.position.y + player.height / 2))
                persp.setTransform(1, 0, 0, 1, 0, 0);   
                hurtingScale = null
            }, 50);
        }
    }

    Healt(){
        if(this.hp < 0) this.hp = 0
        if(this.actualHealt < 0) this.actualHealt = 0
        if(this.hp > this.hpMax) this.hp = this.hpMax

        //Draw healt content
        persp.fillStyle = '#333333'
        persp.fillRect(player.position.x, player.position.y + player.height, player.width, 3)
        if(this.hp < this.actualHealt){
            //Draw losed healt points
            persp.fillStyle = 'red'
            persp.fillRect(player.position.x + (player.width / 2) - player.width * 0.5 * player.actualHealt / player.hpMax, player.position.y + player.height, player.width * player.actualHealt / player.hpMax, 3)

            //Draw healt points
            persp.fillStyle = '#50ff88'
            persp.fillRect(player.position.x + (player.width / 2) - player.width * 0.5 * player.hp / player.hpMax, player.position.y + player.height, player.width * player.hp / player.hpMax, 3)
            
        }
        else{
            //Draw losed healt points
            persp.fillStyle = 'white'
            persp.fillRect(player.position.x + (player.width / 2) - player.width * 0.5 * player.hp / player.hpMax, player.position.y + player.height, player.width * player.hp / player.hpMax, 3)

            //Draw healt points
            persp.fillStyle = '#50ff88'
            persp.fillRect(player.position.x + (player.width / 2) - player.width * 0.5 * player.actualHealt / player.hpMax, player.position.y + player.height, player.width * player.actualHealt / player.hpMax, 3)
            
        }
        this.actualHealt = (3 * this.actualHealt * 0.25) + (this.hp * 0.25)

        
        
    }

    Draw() {
        this.Healt()
        
        persp.save()
        persp.globalAlpha = this.opacity
        persp.translate(player.position.x + player.width / 2, player.position.y + player.height / 2)
        persp.rotate(this.rotation)
        if(this.damaged)  {
            
            persp.filter = "sepia(1) hue-rotate(-50deg) saturate(5) contrast(2)"
        }
        persp.translate(-(player.position.x + player.width / 2), -(player.position.y + player.height / 2))

        
        persp.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
        
        
        persp.restore()

        if(this.damaged){
            
            
            
            persp.globalAlpha = 0.2
            persp.fillStyle = 'red'
            persp.fillRect(0, 0, canvas.width, canvas.height)

        }else if(persp.globalAlpha < 1){
            persp.globalAlpha += 0.01
            
        }
    }

    Update() {
        if(this.image){

            walls.forEach(wall => {
                if(this.position != null){
                    if(Distance(this.position.x + this.width * 0.5, wall.position.x + wall.width * 0.5,
                        this.position.y + this.height * 0.5, wall.position.y + wall.height * 0.5) < this.height){
                    
                        if(this.position.x + this.velocity.x + this.width > wall.position.x &&
                            this.position.x + this.velocity.x  < wall.position.x + wall.width &&
                            this.position.y + this.height > wall.position.y &&
                             this.position.y < wall.position.y + wall.height){

                                if(this.position.x + this.velocity.x * 10 + 10* this.dashVelocity * this.velocity.x/Math.abs(this.velocity.x) + this.width > wall.position.x &&
                                    this.position.x + this.velocity.x * 10 + 10* this.dashVelocity * this.velocity.x/Math.abs(this.velocity.x) < wall.position.x + wall.width &&
                                    this.position.y + this.height > wall.position.y &&
                                     this.position.y < wall.position.y + wall.height)
                            this.velocity.x = 0
                        }
                        if(this.position.y + this.velocity.y + this.height > wall.position.y &&
                            this.position.y + this.velocity.y < wall.position.y + wall.height &&
                            this.position.x + this.width > wall.position.x &&
                            this.position.x  < wall.position.x + wall.width){
                                if(this.position.y + this.velocity.y * 10 + 10* this.dashVelocity * this.velocity.y/Math.abs(this.velocity.y) + this.height > wall.position.y &&
                                    this.position.y + this.velocity.y * 10 + 10* this.dashVelocity * this.velocity.y/Math.abs(this.velocity.y) < wall.position.y + wall.height &&
                                    this.position.x + this.width > wall.position.x &&
                                    this.position.x  < wall.position.x + wall.width)
                            this.velocity.y = 0
                        }
                    }
                }
            });
        this.Draw()
        
        if(!this.dash) this.dashVelocity = 0
        
        const dashX = this.dashVelocity * (this.velocity.x / Math.abs(this.velocity.x)) || 0
        const dashY = (this.dashVelocity) * (this.velocity.y / Math.abs(this.velocity.y)) || 0
        
        this.position.x += this.velocity.x + dashX
        this.position.y += this.velocity.y + dashY

        this.velocity.x *= 0.95 
        this.velocity.y *= 0.95 
        this.rotation *= 0.9

        if(this.position.x < 0 || this.position.x + this.width >= canvas.width || Math.abs(this.velocity.x)  < 0.01)
            this.velocity.x = 0
        if(this.position.y < 0 || this.position.y + this.height >= canvas.height || Math.abs(this.velocity.y)  < 0.01)
            this.velocity.y = 0

            
    }
    }
}

class Bullet {
    constructor({position, velocity, damage, radius, color}){
        this.position = position
        this.velocity = velocity

        this.radius = radius
        this.damage = damage

        this.color = color

        

        this.chase = true
        this.shield = true
    }

    Draw() {
        persp.beginPath()
        persp.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        persp.fillStyle = this.color
        persp.fill()
        persp.closePath()
    }

    Update() {
        this.Draw()
        
        if(this.shield){
            enemyBullets.forEach((eBullet, index) => {
                if(Distance(eBullet.position.x, this.position.x, eBullet.position.y, this.position.y) < this.radius + eBullet.width){
                    
                    CreateParticles({
                        object: this,
                        color: this.color
                    })
                    
                    enemyBullets.splice(index, 1)
                    if(bullets.includes(this))
                    bullets.splice(bullets.indexOf(this), 1)

                    
                }
            });
        }

        if(this.chase && npcs.length > 0){

            
            
            let distance = 10000000
            let targetX = 0
            let targetY = 0

            npcs.forEach((npc, index) => {
                if(npc.position != null){
                    let tempDist = Distance(this.position.x + this.velocity.x + this.radius, npc.position.x + npc.width * 0.5, this.position.y + this.velocity.y + this.radius, npc.position.y + npc.height * 0.5)
                    
                    if(distance > tempDist){
                        distance = tempDist
                        
                        targetX = npc.position.x + npc.width * 0.5
                        targetY = npc.position.y + npc.height * 0.5 
                    }
                }
            });
            if(distance < this.radius * 70){
                //persp.fillStyle = 'green'
                //persp.fillRect(targetX, targetY, 50, 50)
                

                var tx = targetX - this.position.x, ty = targetY - this.position.y;
                
                var rad = Math.atan2(ty,tx), angle = rad/Math.PI * 180;
                var velX = (tx/distance) * player.bulletSpeed * 2,
                velY = (ty/distance) * player.bulletSpeed * 2;
                this.velocity.x = this.velocity.x * 0.98 + velX * 0.02
                
                this.velocity.y = this.velocity.y *0.98 + velY * 0.02
            }
        }
        
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        
    }

}