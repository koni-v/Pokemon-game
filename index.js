const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d') // canvas context - object responsible for drawing out everything we need for the game

canvas.width = 1240
canvas.height = 576

c.fillStyle = 'white'
c.fillRect(0, 0, canvas.width, canvas.height)

const image = new Image() // html image object
image.src = './img/Pallet Town.png'
console.log(image)

image.onload = () => {
    c.drawImage(image, -750, -400)
}