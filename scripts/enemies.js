
class EnemyBullet {
    constructor({position, velocity, damage}){
        this.position = position
        this.velocity = velocity
        this.color = "red"
        this.width = 3
        this.height = 10

        this.damage = damage
    }

        

    Draw() {
        
        persp.save()
        persp.translate(this.position.x + this.width*.5, this.position.y + this.height*0.5)
        persp.rotate(Math.atan(-this.velocity.y / -this.velocity.x) - Math.PI * 0.5)
        persp.translate(-(this.position.x + this.width*.5), -(this.position.y + this.height*0.5))
        persp.fillStyle = 'red'
        persp.fillRect(this.position.x, this.position.y, this.width, this.height)
        persp.restore()
    }

    Update() {
        this.Draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }

}




class Enemy {
    constructor({position, type}){
        

        this.velocity ={
            x: 0, y: 0
        }

        this.velocityMagnitude = 1

        this.rotation = 0

        this.scale = .02

        this.attack = 20

        this.type = type

        this.death = false

        this.damaged = false

        switch(type){
            case 1:
                this.hp = 100
            break;
            default:
                this.hp = 100
            break
        }
        

        const image = new Image()
        image.src = './enemy.png'
        image.onload = () => {
            this.image = image
            this.width = image.width * this.scale
            this.height =image.height * this.scale

            this.position = {
                x: position.x,
                y: position.y
            }
            enemySize = this.width
        }

    }

    

    Hurt(damage, x, y){
        //audioBullet2Bullet.pause()
        audioBullet2Bullet.currentTime = 0
        audioBullet2Bullet.play()

        this.damaged = true
        this.hp -= damage
        this.rotation = 0.1
        if(this.type == 1)
        this.velocity.x += x 
        else
        this.velocity.x += x * 15

        if(this.type == 1)
        this.velocity.y += y || -player.bulletSpeed * 0.5
        else
        this.velocity.y += y * 15 || -player.bulletSpeed * 5

        CreateParticles({
            object: this,
            color: 'yellow'
        })

        setTimeout(() => {
            this.damaged = false
            this.rotation = 0
        }, 250);
        

        if(this.hp <= 0 || this.hp == null || Number.isNaN(this.hp)) this.Die()
    }

    Die(){
        this.death = true

            CreateParticles({
                object: this,
                color: 'yellow'
            })
            
            if(Math.random() < 0.1 * player.lucky){

                drops.push(new Drop({
                    position:{
                        x: this.position.x,
                        y: this.position.y
                    },
                    velocity:{
                        x: 0,
                        y: 3
                    },
                    type: Math.floor(Math.random() * 12)
                }))
            }

            score += 100
            scoreElement.innerHTML = score
            
            if(npcs.includes(this))
                npcs.splice( npcs.indexOf(this), 1)
            if(npcs.lenght == 0){
                console.log("Respawning")
                randomSeed = 0
                
            }
        
    }

    Draw() {
        
        
        persp.save()
        persp.translate(this.position.x + this.width*.5, this.position.y + this.height*0.5)
        persp.rotate(this.rotation)
        persp.translate(-(this.position.x + this.width*.5), -(this.position.y + this.height*0.5))
        if(this.damaged)  {
            
            persp.filter = "sepia(1) hue-rotate(-50deg) saturate(5) contrast(2)"
        }
        persp.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
        persp.restore()
    }

    Update({velocity}) {
        
        if(this.image){
            //if(this.hp == null || Number.isNaN(this.hp)) npcs.splice(npcs.indexOf(this), 1)
            if(this.type == 1){
                
                this.position.x += velocity.x
                this.position.y += velocity.y + this.velocity.y

                this.velocity.y *= 0.95
            }
            else if(player.position != null){
                //Calcular distancia
                let distance = 0

                distance = Distance(this.position.x + this.velocity.x, player.position.x + player.width * 0.5, 
                    this.position.y + this.velocity.y, player.position.y + player.height * 0.5)                

                var tx = player.position.x - this.position.x, ty = player.position.y - this.position.y;
                
                var rad = Math.atan2(ty,tx), angle = rad/Math.PI * 180; 
                this.rotation = rad - Math.PI * 0.5

                var velX = (tx/distance) * this.velocityMagnitude, 
                velY = (ty/distance) * this.velocityMagnitude;

                this.velocity.x += velX * 0.5
                this.velocity.y += velY * 0.5

                this.velocity.x *= 0.6
                this.velocity.y *= 0.6
                //Fin Calcular distancia

                let xMovement = true, yMovement = true
                walls.forEach(wall => {
                    
                    if(Distance(this.position.x + this.width * 0.5 + this.velocity.x, wall.position.x + wall.width * 0.5,
                        this.position.y + this.height * 0.5 + this.velocity.y, wall.position.y + wall.height * 0.5) < this.width / 2){
                            if(this.position.x + this.velocity.x >= wall.position.x &&
                                this.position.x + this.velocity.x + this.width <= wall.position.x + wall.width)
                                xMovement = false
                            if( this.position.y + this.velocity.y <= wall.position.y &&
                                this.position.y + this.velocity.y + this.height >= wall.position.y + wall.height)
                                yMovement = false
                    }
                    

                });
                if(xMovement)
                this.position.x += this.velocity.x
                if(yMovement)
                this.position.y += this.velocity.y
            }
            if(player.position != null)
            if(Math.sqrt(Math.pow(player.position.x - this.position.x, 2) + Math.pow(player.position.y - this.position.y, 2)) <
             player.width * 0.4 + this.width * 0.4 && !game.over){
                
                player.Hurt(this.attack)
             }

            this.Draw()
        }
    }

    Shoot(){
        if(this.type == 1){
            enemyBullets.push(new EnemyBullet({
                position: {
                    x: this.position.x + this.width / 2,
                    y: this.position.y + this.height
                },
                velocity: {
                    x: this.velocity.x,
                    y: this.velocity.y + 5
                },
                damage: this.attack
            }))
        }
        else if(true){
            
            let distanceX = player.position.x + player.width * 0.5 - this.position.x - this.width * 0.5 
            let distanceY = player.position.y + player.height * 0.5 - this.position.y - this.height * 0.5
            let magnitude = Math.sqrt(distanceX * distanceX + distanceY * distanceY)
            
            let velocityX = distanceX / magnitude
            let velocityY = distanceY / magnitude

            enemyBullets.push(new EnemyBullet({
                position: {
                    x: this.position.x + this.width / 2,
                    y: this.position.y + this.height / 2
                },
                velocity: {
                    x: velocityX * 5,
                    y: velocityY * 5
                },
                damage: this.attack
            }))
        }
    }
}



class Grid{
    constructor(){
        this.position = {
            x: 0, y: 0
        }

        this.velocity = {
            x: 3, y: 0.2
        }

        this.enemies = []

        

        const rows = Math.floor( Math.random() * 3 + 1)
        const colums = Math.floor( Math.random() * 4 + 2)
        this.position.y -= rows * enemySize * 0.6
        this.width = colums * enemySize + enemySize/4;
        
        for(let i = 0; i < colums; i++){
            for(let j = 0; j < rows; j++){
                let newEnemy = new Enemy({position:{
                    x: i * enemySize + (j % 2)*enemySize/3, y: this.position.y + j * enemySize * 0.6
                },
                type: 1
                })
                npcs.push(newEnemy)
                this.enemies.push(newEnemy)
                
            }
            
        }
        
        
    }

    Update(){
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        //this.velocity.y = 0

        if(this.position.x + this.width >= canvas.width || this.position.x <= 0){
            this.velocity.x = -this.velocity.x
            //this.velocity.y = 50
        }
    }
}