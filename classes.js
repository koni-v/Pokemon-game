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
        c.fillStyle = 'rgba(255, 0, 0, 0)'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

// ---------------------- Sprite Class - Image Class ----------------------

class Sprite {
    constructor({ 
        position, 
        velocity, 
        image, 
        frames = { max: 1, hold: 10 }, 
        sprites, 
        animate = false, 
        rotation = 0 }) {
        this.position = position
        this.image = new Image()
        this.frames = {...frames, val: 0, elapsed: 0} // The background image has 1 frame, the player images have 4 frames (val is for what frame it should display, elapsed is amount of frames that have elapsed over time)
        this.loaded = false
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
            this.loaded = true
        }
        this.image.onerror = () => {
            console.error("Error loading image:", image.src);
        };
        this.image.src = image.src
        this.animate = animate // Wheather it should loop through all the frames od the image, making an animation
        this.sprites = sprites // Which image from up, down, left and right should be dispalyed
        this.opacity = 1
        this.rotation = rotation // Used for rotation of the fireball sprite
    }

    draw() {
        if (!this.loaded) return;
        c.save() // Save the current canvas state
        c.translate(this.position.x + this.width / 2, 
                    this.position.y + this.height / 2) // Translate canvas origin
        c.rotate(this.rotation)
        c.translate(-this.position.x - this.width / 2, 
                    -this.position.y - this.height / 2) // Translate back to original
        c.globalAlpha = this.opacity // Set the opacity for the drawing operation
        
        // Draw Image
        c.drawImage(
            this.image,
            this.frames.val * this.width, // X coordinate for the cro (0*48)
            0, // Y coordinate for the crop
            this.image.width / this.frames.max, // Crop width
            this.image.height, // Crop height
            this.position.x, // X position on the canvas where the image will be drawn
            this.position.y, // Y position on the canvas where the image will be drawn
            this.image.width / this.frames.max, // Width of the drawn image
            this.image.height // Height of the drawn image
        )
        c.restore() // Restore the canvas state to what it was before save()

        if(!this.animate) return
        
        // Making the image animation
        if(this.frames.max > 1){
            this.frames.elapsed++
        }

        if(this.frames.elapsed % this.frames.hold === 0){ // We devide it by 10 so we can slow the animation down
            // Changing the players image frame that is displayed
            if(this.frames.val < this.frames.max - 1) this.frames.val ++
            else this.frames.val = 0
        }
    }
}

// --------------------------- Monster Class --------------------------
class Monster extends Sprite {
    constructor({
        position, 
        velocity, 
        image, 
        frames = { max: 1, hold: 10 }, 
        sprites, 
        animate = false, 
        rotation = 0, 
        isEnemy = false, 
        name,
        attacks
    }){
        super({
            position, 
            velocity, 
            image, 
            frames, 
            sprites, 
            animate, 
            rotation
        })
        this.health = 100
        this.isEnemy = isEnemy
        this.name = name // Name of the sprite
        this.attacks = attacks // Attacks list
    }

    // Attack function
    attack({attack, recipient, renderedSprites}){
        // Set attack message
        let dialogueBox = document.querySelector('#dialogue-box')
        dialogueBox.style.display = 'block'
        dialogueBox.innerHTML = this.name + " used " + attack.name
        
        let movementDirection = 20
        let healthBar = '#dragon-health-bar-current'
        let rotation = 1
        
        if(this.isEnemy) {
            movementDirection = -20
            healthBar = '#fire-health-bar-current'
            rotation = -2.2
        }
        
        recipient.health -= attack.damage

        switch(attack.name){
            // ------------------------- Tackle attack -------------------------
            case "Tackle":
                const tl = gsap.timeline()

                tl.to(this.position, { // Move attacker left
                    x: this.position.x - movementDirection
                }).to(this.position, { // Move attacker right
                    x: this.position.x + movementDirection*2,
                    duration: 0.1,
                    onComplete: () => { // After the attackers second move, animate the hit of the recipient
                        audio.TackleHit.play()
                        gsap.to(healthBar, { // Subtrackt from the recipient's health bar
                            width: recipient.health + '%'
                        })
                        
                        gsap.to(recipient.position, { // Move the recipient right than left 5 times with a duration od 0.08
                            x: recipient.position.x + 10,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08,
                        })

                        gsap.to(recipient, { // Fade the recipient's opacity to 0, 5 times
                            opacity: 0,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08
                        })
                    }
                }).to(this.position, { // Move the attacker to it's original position
                    x: this.position.x
                })
                break
            

            // ------------------------- Fireball attack -------------------------
            case "Fireball":
                audio.InitFireball.play()
                fireBall.position = { // Set the fireball's start position as the attacker's start postiton
                    x: this.position.x,
                    y: this.position.y
                }

                fireBall.rotation = rotation

                renderedSprites.splice(1, 0, fireBall) // Placing the fireball sprite aftre the attacker and before the recipient sprite

                gsap.to(fireBall.position, { // Move the fireball from the attacker to the recipient
                    x: recipient.position.x,
                    y: recipient.position.y,
                    onComplete: () => { // Remove the fireball sprite when it reaches the recipient
                        audio.FireballHit.play()
                        gsap.to(healthBar, { // Subtrackt from the recipient's health bar
                            width: recipient.health + '%'
                        })
                        
                        gsap.to(recipient.position, { // Move the recipient right than left 5 times with a duration od 0.08
                            x: recipient.position.x + 10,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08,
                        })

                        gsap.to(recipient, { // Fade the recipient's opacity to 0, 5 times
                            opacity: 0,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08
                        })
                        renderedSprites.splice(1, 1) // Removing the fireball sprite
                    }
                })
                break
        }
    }

    // Faint function
    faint() {
        // Set faint message
        let dialogueBox = document.querySelector('#dialogue-box')
        dialogueBox.innerHTML = this.name + " fainted"
        gsap.to(this.position, { // Move sprite down
            y: this.position.y + 20
        })
        gsap.to(this, { // fade out the spriite
            opacity: 0
        })
        audio.Victory.play()
        audio.Battle.stop()
    }
}