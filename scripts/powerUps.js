
class Drop{
    constructor({position, velocity, type}){
        this.position = position
        this.velocity = velocity
        this.type = type
        this.scale = 0.04
        this.power = 1

        
        this.info = ""
        

        // persp.font = "30px Arial";
        // persp.fillText(info, player.position.x, player.position.y);

        

        const image = new Image()
        image.src = './img/health.png'
        image.onload = () => {
            this.image = image
            this.width = image.width * this.scale
            this.height =image.height * this.scale

        }

    }

    Catched(){
        audioPower.currentTime = 0
        audioPower.play()
        player.hp += this.power * player.hp * 0.2
        score += 15
        scoreElement.innerHTML = score

        switch(this.type){
            case 1:
                player.hp += this.power * player.hp * 0.5
                this.info = "HP up+"
            break;
            case 2:
                player.attack += this.power * player.attack * 0.5
                this.info = "DP up+"
            break;
            case 3:
                player.hpMax += this.power * player.hpMax * 0.5
                this.info = "MaxHP up+"
            break;
            case 4:
                player.speedAttack += this.power * player.speedAttack * 0.5
                this.info = "Shoot up+"
            break;
            case 5:
                player.velocityMagnitude += this.power * player.velocityMagnitude * 0.5
                this.info = "Velocity up+"
            break;
            case 6:
                player.bulletSpeed += this.power * player.bulletSpeed * 0.5
                this.info = "ShootSpeed up+"
            break;
            case 7:
                player.lucky += this.power * player.lucky * 0.5
                this.info = "Luck up+"
            break;
            case 8:
                player.critical += this.power * player.critical * 0.5
                this.info = "Critical % up+"
            break;
            case 9:
                player.criticalDamage += this.power * player.criticalDamage * 0.5
                this.info = "CriticalDamage up+"
            break;
            case 10:
                player.bulletSize += this.power * player.bulletSize * 0.5
                this.info = "ShootSize up+"
            break;
            case 11:
                //player.scale += this.power * player.scale * 0.5
                player.Scaled(player.scale + 0.1)
                this.info = "Size up+"
            break;
            default:
                player.hp += this.power * player.hp * 0.5
                this.info = "Default up+"
            break
        }
    }

    Draw() {
        //persp.fillStyle = 'red'
        //persp.fillRect(this.position.x, this.position.y, this.width, this.height)
        persp.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }

    Update() {
        if(this.image){
            this.Draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
        }
    }
}

class Info{
    constructor({position, velocity, text}){
        this.position = position
        this.velocity = velocity
        
        this.scale = 1

        this.text = text
        this.opacity = 1
        

    }

    Draw() {

        persp.save()
        persp.globalAlpha = this.opacity
        
        persp.fillStyle = '#99ffff'

        persp.font = "15px VT323";
        persp.fillText(this.text, this.position.x, this.position.y);
        
        persp.closePath()
        persp.restore()
        
    }

    Update() {
        //if(this.image){
            this.Draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
            if(this.opacity > 0) this.opacity -= 0.01
        //}
    }
}

class Interface{
    constructor(){
        this.lose = false
        this.scale = 0.5

        this.position = {
            x: 20,
            y: 20
        }

        const image = new Image()
        image.src = './img/menuPause.png'
        image.onload = () => {
            this.image = image
            this.width = image.width * this.scale
            this.height =image.height * this.scale

        }
    }

    Draw(){
        if(this.image){
            persp.drawImage(this.image, canvas.width * 0.5 - this.width * 0.5, canvas.height * 0.5 - this.height * 0.5, this.width, this.height )
            
            // persp.strokeStyle = "blue"
            // if(this.lose) persp.strokeStyle = "red"
            // persp.rect(this.position.x, this.position.y, this.width, this.height)
            // persp.stroke()
        }
    }
}

class Btns{
    constructor({position, width, height, text, color, hoverColor, type}){
        this.position = position
        this.width = width
        this.height = height
        this.text = text
        this.color = color
        this.hoverColor = hoverColor
        this.type = type
        this.hover = false
    }

    Utility(){
        switch(this.type){
            case 1: 
                game.pause = false
                game.active = true
            break;
            case 2:
                player = new Player()
                grids = []
                bullets = []
                enemyBullets = []
                particles = []
                walls = []
                //stars = []
                npcs = []
                drops = []
                infos = []
                interfaces = new Interface()

                restoreWalls()

                frames = 0
                score = 0
                scoreElement.innerHTML = score
                randomSeed = Math.floor((Math.random() * 500) + 500)
                randomTimeShoot = 100

                game.over = false
                game.active = true
                game.pause = false
            break
        }
    }

    Draw(){
        persp.fillStyle = this.color
        if(this.hover) persp.fillStyle = this.hoverColor
        persp.fillRect(this.position.x, this.position.y, this.width, this.height)

        persp.fillStyle = '#000000'

        persp.font = "30px VT323";
        persp.fillText(this.text, this.position.x + persp.measureText(this.text).width * 0.5, this.position.y + this.height * 0.6);
    }

    
}

class Particle {
    constructor({position, velocity, radius, color}){
        this.position = position
        this.velocity = velocity

        this.radius = radius
        this.color = color
        this.opacity = 1
    }

    Draw() {
        persp.save()
        persp.globalAlpha = this.opacity
        persp.beginPath()
        persp.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        persp.fillStyle = this.color
        persp.fill()
        persp.closePath()
        persp.restore()
    }

    Update() {
        this.Draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.opacity -= 0.01
    }

}


class Star {
    constructor({position, velocity, radius}){
        this.position = position
        this.velocity = velocity

        this.radius = radius
        
        
    }

    Draw() {
        persp.save()
        persp.globalAlpha = 0.2
        persp.beginPath()
        persp.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        persp.fillStyle = '#99ffff'
        persp.fill()
        persp.closePath()
        persp.restore()
    }

    Update() {
        this.Draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        
    }

}

class Walls{
    constructor({position}){
        this.position = position
        this.width = 5
        this.height = 5
    }

    Draw() {
        
        persp.fillStyle = '#ffffff'
        persp.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    Shock(){
        enemyBullets.forEach((enemyBullet, indexBullet) => {
            if(enemyBullet.position.x >= this.position.x &&
                enemyBullet.position.x + enemyBullet.width <= this.position.x + this.width &&
                enemyBullet.position.y >= this.position.y &&
                enemyBullet.position.y + enemyBullet.height + enemyBullet.velocity.y <= this.position.y + this.height
                || Distance(this.position.x + this.width * 0.5, enemyBullet.position.x + enemyBullet.width * 0.5, 
                    this.position.y + this.height * 0.5, enemyBullet.position.y + enemyBullet.height * 0.5) < 3){
                        this.Destroy()
                        if(enemyBullets.includes(enemyBullet))
                            enemyBullets.splice(indexBullet, 1)
                    }
        });

        bullets.forEach((bullet, indexBullet) => {
            if(Distance(this.position.x + this.width * 0.5, bullet.position.x + bullet.radius, 
                    this.position.y + this.height * 0.5, bullet.position.y + bullet.radius) < 3 + bullet.radius * 0.5){
                        this.Destroy()
                        if(bullets.includes(bullet))
                            bullets.splice(indexBullet, 1)
                    }
        });
        drops.forEach(drop => {
            if(drop.position.x + drop.width > this.position.x &&
                drop.position.x  < this.position.x + this.width &&
                drop.position.y + drop.height > this.position.y &&
                 drop.position.y < this.position.y + this.height){
                    drop.velocity.y = 0
                }
        });
    }

    Destroy(){
        if(walls.includes(this)){
            walls.splice( walls.indexOf(this), 1)
            CreateParticles({
                object: this,
                color: 'white'
            })
        }
    }

    Update() {
        this.Shock()
        this.Draw()
        
    }
}