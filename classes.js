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