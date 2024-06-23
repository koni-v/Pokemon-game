const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d') // canvas context - object responsible for drawing out everything we need for the game

canvas.width = 1240
canvas.height = 576

c.fillStyle = 'white'
c.fillRect(0, 0, canvas.width, canvas.height)

const image = new Image() // html image object
image.src = './img/Pallet Town.png'

const playerImage = new Image()
playerImage.src = './img/playerDown.png'

image.onload = () => {
    c.drawImage(image, -865, -560)
    c.drawImage(
        playerImage,
        0, // x coordinate for the crop 
        0, // y coordinate for the crop 
        playerImage.width / 4, // crop width
        playerImage.height, // crop height
        canvas.width / 2 - playerImage.width / 2, // x coordinate on canvas
        canvas.height / 2 - playerImage.height / 2, // y coordinate on canvas
        playerImage.width / 4, // croped image width
        playerImage.height // croped image height
    )
}



