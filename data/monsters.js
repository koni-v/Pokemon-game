// ----------------- Load images for monsters ------------------
const fireImage = new Image()
fireImage.src = './img/fireSprite.png'

const dragonImage = new Image()
dragonImage.src = './img/dragonSprite.png'

// ------------------------ Monster object ------------------------
const monsters = {
    Fire: { // Fire monster
        position: {
            x: 280,
            y: 325
        },
        image: {
            src: './img/fireSprite.png'
        },
        frames: {
            max: 4,
            hold: 30
        },
        animate: true,
        name: "Fire",
        attacks: [attacks.Tackle, attacks.Fireball]
    },
    Dragon: { // Dragon monster
        position: {
            x: 800,
            y: 100
        },
        image: {
            src: './img/dragonSprite.png'
        },
        frames: {
            max: 4,
            hold: 30
        },
        animate: true,
        isEnemy: true,
        name: 'Dragon',
        attacks: [attacks.Tackle, attacks.Fireball]
    }
}