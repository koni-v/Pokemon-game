const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d') // canvas context - object responsible for drawing out everything we need for the game

// Set canvas width and height
canvas.width = 1240
canvas.height = 576

c.fillStyle = 'white'
c.fillRect(0, 0, canvas.width, canvas.height)

const image = new Image() // Create a html image object
image.src = './img/Pallet Town.png'

const playerImage = new Image() // Create player image object
playerImage.src = './img/playerDown.png'

class Sprite {
    constructor({position, velocity, image}) {
        this.position = position
        this.image = image
    }

    draw() {
        // Draw background image
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

const background = new Sprite({
    // Set background image x and y position
    position:{
        x: -865,
        y: -560
    },
    image: image
})

// ------------------------- Player Movement -------------------------

const keys = {
    w: { pressed: false },
    a: { pressed: false },
    s: { pressed: false },
    d: { pressed: false }
}

function animate(){
    window.requestAnimationFrame(animate) // Creating an infinite loop animation
    
    background.draw()
    c.drawImage(
        playerImage,
        0, // x coordinate for the crop 
        0, // y coordinate for the crop 
        playerImage.width / 4, // crop width
        playerImage.height, // crop height
        canvas.width / 2 - playerImage.width / 4 / 2, // x coordinate on canvas
        canvas.height / 2 - playerImage.height / 2, // y coordinate on canvas
        playerImage.width / 4, // croped image width
        playerImage.height // croped image height
    )

    // Background movement based on key pressed states
    if(keys.w.pressed && lastKey === 'w') background.position.y += 3 
    else if(keys.a.pressed && lastKey === 'a') background.position.x += 3
    else if(keys.s.pressed && lastKey === 's') background.position.y -= 3
    else if(keys.d.pressed && lastKey === 'd') background.position.x -= 3
}

animate()

let lastKey = ''
window.addEventListener("keydown", (e) => {
    switch(e.key){
        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break
        
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break
        
        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break
        
        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break 

    }
})

window.addEventListener("keyup", (e) => {
    switch(e.key){
        case 'w':
            keys.w.pressed = false
            break
        
        case 'a':
            keys.a.pressed = false
            break
        
        case 's':
            keys.s.pressed = false
            break
        
        case 'd':
            keys.d.pressed = false
            break 

    }
})
    
    