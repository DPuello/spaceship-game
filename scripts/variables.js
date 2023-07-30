const canvas = document.querySelector('canvas')
const persp = canvas.getContext('2d')
const scoreElement = document.querySelector('#scoreElement')
const mainDiv = document.querySelector('#mainDiv')

canvas.width = 1024;
canvas.height = 576;


let offsetX = 0
let offsetY = 0
let scrollX = 0
let scrollY = 0

mainDiv.style.transform = 'scale(' +Math.min((innerHeight / canvas.height), (innerWidth / canvas.width)) *0.9 + ')'

let hurting = null
let hurtingScale = null
let volume = 1

enemySize = 100

const audioPower = new Audio("./sounds/power.mp3")
const audioShoot = new Audio("./sounds/shoot.mp3")
const audioDamage = new Audio("./sounds/damage.mp3")
const audioBullet2Bullet = new Audio("./sounds/bullet2bullet.mp3")



let grids = []
let bullets = []
let enemyBullets = []
let particles = []
let stars = []
let npcs = []
let drops = []
let infos = []

let btns = []
let walls = []

let frames = 0
let score = 0
let randomSeed = Math.floor((Math.random() * 500) + 500)
let randomTimeShoot = 100

let game = {
    over: false,
    pause: false,
    active: true
}

const keys = {
    a:{
        pressed: false
    },
    w:{
        pressed: false
    },
    d:{
        pressed: false
    },
    s:{
        pressed: false
    },
    arrowLeft:{
        pressed: false
    },
    arrowUp:{
        pressed: false
    },
    arrowRight:{
        pressed: false
    },
    arrowDown:{
        pressed: false
    },
    space:{
        pressed: false
    },
    dash:{
        pressed: false
    }
}

function Distance(x1, x2, y1, y2){
    let x = x2 - x1
    let y = y2 - y1
    
    let distance = Math.sqrt((x * x) + (y * y))
    return distance
}