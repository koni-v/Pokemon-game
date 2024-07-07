// ----------------------------- Load Images -----------------------------

const battleBackgroundImage = new Image()
battleBackgroundImage.src = './img/battleBackground.png'

const fireBallImage = new Image()
fireBallImage.src = './img/fireball.png'

// ------------------------- Create Sprites - Create Images -------------------------

const battleBackground = new Sprite({ // Battle background image
    position: {
        x: 0,
        y: 0
    },
    image: battleBackgroundImage
})

const fire = new Monster(monsters.Fire)
const dragon = new Monster(monsters.Dragon)

const fireBall = new Sprite({ // Fireball image
    position: {
        x: 0,
        y: 0
    },
    image: fireBallImage,
    frames: {
        max: 4,
        hold: 10 
    },
    animate: true,
})

// ---------------------------- Battle animation ----------------------------

const renderedSprites = [dragon, fire]

fire.attacks.forEach(attack => {
    const button = document.createElement('button')
    button.innerHTML = attack.name
    document.querySelector('#left-attack-div').append(button)
})

function animateBattle(){
    window.requestAnimationFrame(animateBattle)
    //console.log('animating battle');
    battleBackground.draw()

    renderedSprites.forEach((sprite) => {
        sprite.draw()
    })
}

animateBattle()

//------------------ Event listeners for our buttons (attacks) ------------------

const queue = []

document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", (e) => {
        // Fire attacks
        const selectedAttack = attacks[e.currentTarget.innerHTML]
        fire.attack({
            attack: selectedAttack,
            recipient: dragon,
            renderedSprites
        })

        // Dragon faints 
        if(dragon.health <= 0){
            queue.push(() => {
                dragon.faint()
            })
            return
        }
        
        // Dragon attacks 
        const randomAttack = dragon.attacks[Math.floor(Math.random() * dragon.attacks.length)]
        queue.push(() => {
            dragon.attack({
                attack: randomAttack,
                recipient: fire,
                renderedSprites
            })

            // Fire faints 
            if(fire.health <= 0){
                queue.push(() => {
                    fire.faint()
                })
                return
            }
        })
    })

    button.addEventListener('mouseenter', (e) => {
        const selectedAttack = attacks[e.currentTarget.innerHTML]
        document.querySelector('#attack-type').innerHTML = selectedAttack.type
        document.querySelector('#attack-type').style.color = selectedAttack.color
    })
})

document.querySelector('#dialogue-box').addEventListener('click', (e) => {
    if(queue.length > 0) {
        queue[0]()
        queue.shift()
    }else{
        e.currentTarget.style.display = 'none'
    }
})