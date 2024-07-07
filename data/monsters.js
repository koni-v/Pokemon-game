const fireImage = new Image()
fireImage.src = './img/fireSprite.png'

const dragonImage = new Image()
dragonImage.src = './img/dragonSprite.png'

const monsters = {
    Fire: { // Fire image
        position: {
            x: 280,
            y: 325
        },
        image: fireImage,
        frames: {
            max: 4,
            hold: 30
        },
        animate: true,
        name: "Fire",
        attacks: [attacks.Tackle, attacks.Fireball]
    },
    Dragon: { // Dragon image
        position: {
            x: 800,
            y: 100
        },
        image: dragonImage,
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