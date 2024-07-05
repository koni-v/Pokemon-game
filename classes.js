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
    constructor({ position, velocity, image, frames = { max: 1, hold: 10 }, sprites, animate }) {
        this.position = position
        this.image = image
        this.frames = {...frames, val: 0, elapsed: 0} // The background image has 1 frame, the player images have 4 frames (val is for what frame it should display, elapsed is amount of frames that have elapsed over time)

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
        this.animate = animate
        this.sprites = sprites // Which image from up, down, left and right should be dispalyed
    }

    draw() {
        // Draw the image
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

        if(!this.animate) return
        
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