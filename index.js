// --------------------------- Setup Canvas ---------------------------

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d') // Canvas context - object responsible for drawing out everything we need for the game

// Set canvas width and height
canvas.width = 1024
canvas.height = 576

// ------------------------- Collisions Mapping -------------------------

const collisionsMap = [] // Array of subarrays containing 70 collisions each
for (let i = 0; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i, i + 70))
}

const battleZonesMap = []
for (let i = 0; i < battleZonesData.length; i += 70) {
    battleZonesMap.push(battleZonesData.slice(i, i + 70))
}

// ------------------------- Create Boundaries -------------------------

const boudaries = []
const battleZones = []
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

battleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025) {
            battleZones.push(
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

// console.log(battleZones);
// console.log(boudaries)

// ----------------------------- Load Images -----------------------------

const backgroundImage = new Image()
backgroundImage.src = './img/palletTown.png'

const playerDownImage = new Image()
playerDownImage.src = './img/playerDown.png'

const playerUpImage = new Image()
playerUpImage.src = './img/playerUp.png'

const playerRightImage = new Image()
playerRightImage.src = './img/playerRight.png'

const playerLeftImage = new Image()
playerLeftImage.src = './img/playerLeft.png'

const foregroundImage = new Image()
foregroundImage.src = './img/foregroundObjects.png'

// ------------------------- Create Sprites - Create Images -------------------------

const player = new Sprite({ // Player image
    position: {
        x: canvas.width / 2 - 192 / 4 / 2, // 192 - Fixed width of the player images
        y: canvas.height / 2 - 68 / 2 // 68 - Fixed height of the player images
    },
    image: playerDownImage,
    frames: {
        max: 4,
        hold: 10
    },
    sprites: {
        down: playerDownImage,
        up: playerUpImage,
        left: playerLeftImage,
        right: playerRightImage
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

const foreground = new Sprite({ // Foreground image
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage
})

const keys = { // Object to track key press states
    w: { pressed: false },
    a: { pressed: false },
    s: { pressed: false },
    d: { pressed: false }
}

// ---------------------------- Collision detection ----------------------------

function rectangularCollision({ rectangle1, rectangle2 }) {
    return (rectangle1.position.x + rectangle1.width >= rectangle2.position.x && // Left collision
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width && // Right collision
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height && // Top collision
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y // Bottom collision
    )
}

const movables = [background, ...boudaries, foreground, ...battleZones] // Array of objects that can be moved

const battle = {
    initiated: false
}

function animate() {
    const animationId = window.requestAnimationFrame(animate) // Creating an infinite loop animation
    
    // Draw images
    background.draw()
    boudaries.forEach(boundary => {
        boundary.draw()
    })
    battleZones.forEach(battleZone => {
        battleZone.draw()
    })
    player.draw()
    foreground.draw()

    let moving = true
    player.animate = false

    //----------------------------- Activating a battle -----------------------------

    if(battle.initiated) return

    // Check for battle zones collision, when keys are pressed
    if(keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed){
        for (let i = 0; i < battleZones.length; i++) {

            const battleZone = battleZones[i]
            // Calculating the overlaping area between the player and the battle zones
            // (MIN of the right sides of both - MAX of the left sides of both) * (MIN of the bottom sides of both - MAX of the top sides of both)
            const overlapingArea = (Math.min(player.position.x + player.width, battleZone.position.x + battleZone.width) - 
            Math.max(player.position.x, battleZone.position.x)) *
            (Math.min(player.position.y + player.height, battleZone.position.y + battleZone.height) - 
            Math.max(player.position.y, battleZone.position.y))

            // Detecting a battle zone collision only when the overlapping area is greater than half the player's area
            // and matches the random factor which simulates battle initiation probability
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: battleZone
                })  
                && overlapingArea > (player.width * player.height) / 2 
                && Math.random() < 0.02
            ) {
                console.log("Activate a battle")
                // Deactivate current animation loop
                window.cancelAnimationFrame(animationId)
                battle.initiated = true
                audio.Map.stop()
                audio.InitBattle.play()
                audio.Battle.play()

                // Making an animation for the battle scene transition
                gsap.to('#overlappingDiv', {
                    opacity: 1, // Fade in the element to full opacity
                    repeat: 3, // Repeat the animation 3 times
                    yoyo: true, // Reverse the animation direction every other time
                    duration: 0.4, // Each animation lasts 0.4 seconds
                    onComplete() { // Function to call when the animation completes
                        gsap.to('#overlappingDiv', {
                            opacity: 1, // Fade in the element to full opacity again
                            duration: 0.4, // Animation lasts 0.4 seconds
                            onComplete() { // Function to call when the animation completes
                                // Activate a new animation loop
                                initBattle()
                                animateBattle()
                                gsap.to('#overlappingDiv', {
                                    opacity: 0, // Fade out the element to no opacity
                                    duration: 0.4, // Animation lasts 0.4 seconds
                                })    
                            }
                        })                        
                    }
                })
                break
            }
        }
    }

    // ---------------------------- Player Movement ----------------------------
    
    // Background movement based on key pressed states
    if (keys.w.pressed && lastKey === 'w') {
        player.animate = true
        player.image = player.sprites.up

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
        player.animate = true
        player.image = player.sprites.left

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
        player.animate = true
        player.image = player.sprites.down

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
        player.animate = true
        player.image = player.sprites.right

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

//animate()

// ---------------------------- Key Event Listeners ----------------------------

let lastKey = ''
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

// ----------------------------- Play Map Music -----------------------------

let clicked = false
addEventListener('click', () => {
    if(!clicked){
        audio.Map.play()
        clicked = true
    }
})