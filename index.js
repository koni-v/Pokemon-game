// --------------------------- Setup Canvas ---------------------------

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d') // Canvas context - object responsible for drawing out everything we need for the game

// Set canvas width and height
canvas.width = 1240
canvas.height = 576

// ------------------------- Collisions Mapping -------------------------

const collisionsMap = [] // Array of subarrays containing 70 collisions each
for (let i = 0; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i, i + 70))
}

// ------------------- Boundary Class - Collision Block -------------------

class Boundary {
    // The map is scaled to 400%, the original size of the collision blocks is 12 x 12
    static width = 48
    static height = 48
    constructor({ position }) {
        this.position = position
        this.width = 48
        this.height = 48
    }
    draw() {
        c.fillStyle = 'rgba(255, 0, 0, 0.5)'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

// ------------------------- Create Boundaries -------------------------

const boudaries = []
const offset = { // Offset values used for the background and collision blocks
    x: -865,
    y: -565
}

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025) {
            boudaries.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
        }
    })
})

console.log(boudaries)

// ----------------------------- Load Images -----------------------------

const backgroundImage = new Image()
backgroundImage.src = './img/Pallet Town.png'

const playerImage = new Image()
playerImage.src = './img/playerDown.png'

// ---------------------- Sprite Class - Image Class ----------------------

class Sprite {
    constructor({ position, velocity, image, frames = { max: 1 } }) {
        this.position = position
        this.image = image
        this.frames = frames // The background image has 1 frame, the player images have 4 frames

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
    }

    draw() {
        // Draw the image
        c.drawImage(
            this.image,
            0, // X coordinate for the crop
            0, // Y coordinate for the crop
            this.image.width / this.frames.max, // Crop width
            this.image.height, // Crop height
            this.position.x, // X position on the canvas where the image will be drawn
            this.position.y, // Y position on the canvas where the image will be drawn
            this.image.width / this.frames.max, // Width of the drawn image
            this.image.height // Height of the drawn image
        )
    }
}

// ------------------------- Create Sprites - Create Images -------------------------

const player = new Sprite({ // Player image
    position: {
        x: canvas.width / 2 - 192 / 4 / 2, // 192 - Fixed width of the player images
        y: canvas.height / 2 - 68 / 2 // 68 - Fixed height of the player images
    },
    image: playerImage,
    frames: {
        max: 4
    }
})

const background = new Sprite({ // Background image
    // Set background image x and y position
    position: {
        x: offset.x,
        y: offset.y
    },
    image: backgroundImage
})

// ------------------------- Player Movement -------------------------

const keys = { // Object to track key press states
    w: { pressed: false },
    a: { pressed: false },
    s: { pressed: false },
    d: { pressed: false }
}

// Function to check for collision
function rectangularCollision({ rectangle1, rectangle2 }) {
    return (rectangle1.position.x + rectangle1.width >= rectangle2.position.x && // Left collision
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width && // Right collision
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height && // Top collision
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y // Bottom collision
    )
}

const movables = [background, ...boudaries] // Array of objects that can be moved

function animate() {
    window.requestAnimationFrame(animate) // Creating an infinite loop animation

    // Draw images
    background.draw()
    boudaries.forEach(boundary => {
        boundary.draw()
    })
    player.draw()

    let moving = true

    // Background movement based on key pressed states
    if (keys.w.pressed && lastKey === 'w') {
        for (let i = 0; i < boudaries.length; i++) {

            const boundary = boudaries[i]

            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {
                    ...boundary,
                    position: {
                        x: boundary.position.x,
                        y: boundary.position.y + 3
                    }
                }
            })
            ) {
                console.log("Colliding")
                moving = false
                break
            }
        }
        if (moving) { // Only moving the movable objects if there is no collisions
            movables.forEach(movable => {
                movable.position.y += 3
            })
        }
    }
    else if (keys.a.pressed && lastKey === 'a') {
        for (let i = 0; i < boudaries.length; i++) {

            const boundary = boudaries[i]

            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {
                    ...boundary,
                    position: {
                        x: boundary.position.x + 3,
                        y: boundary.position.y
                    }
                }
            })
            ) {
                console.log("Colliding")
                moving = false
                break
            }
        }
        if (moving) {
            movables.forEach(movable => {
                movable.position.x += 3
            })
        }
    }
    else if (keys.s.pressed && lastKey === 's') {
        for (let i = 0; i < boudaries.length; i++) {

            const boundary = boudaries[i]

            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {
                    ...boundary,
                    position: {
                        x: boundary.position.x,
                        y: boundary.position.y - 3
                    }
                }
            })
            ) {
                console.log("Colliding")
                moving = false
                break
            }
        }
        if (moving) {
            movables.forEach(movable => {
                movable.position.y -= 3
            })
        }
    }
    else if (keys.d.pressed && lastKey === 'd') {
        for (let i = 0; i < boudaries.length; i++) {

            const boundary = boudaries[i]

            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {
                    ...boundary,
                    position: {
                        x: boundary.position.x - 3,
                        y: boundary.position.y
                    }
                }
            })
            ) {
                console.log("Colliding")
                moving = false
                break
            }
        }
        if (moving) {
            movables.forEach(movable => {
                movable.position.x -= 3
            })
        }
    }
}

animate()

let lastKey = ''
// Event listener for keydown
window.addEventListener("keydown", (e) => {
    switch (e.key) {
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

// Event listener for keyup
window.addEventListener("keyup", (e) => {
    switch (e.key) {
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
