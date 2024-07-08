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

let dragon
let fire

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

let renderedSprites
let queue
let battleaAnimationId

function initBattle(){
    document.querySelector('#user-interface').style.display = 'block'
    document.querySelector('#dialogue-box').style.display = 'none'
    document.querySelector('#fire-health-bar-current').style.width = '100%'
    document.querySelector('#dragon-health-bar-current').style.width = '100%'
    document.querySelector('#left-attack-div').replaceChildren()
    
    fire = new Monster(monsters.Fire)
    dragon = new Monster(monsters.Dragon)
    renderedSprites = [dragon, fire]
    queue = []
    
    fire.attacks.forEach(attack => {
        const button = document.createElement('button')
        button.innerHTML = attack.name
        document.querySelector('#left-attack-div').append(button)
    })

    //------------------ Event listeners for our buttons (attacks) ------------------

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

                queue.push(() => {
                    // Fade back to black
                    gsap.to('#overlappingDiv', {
                        opacity: 1,
                        onComplete: () => {
                            window.cancelAnimationFrame(battleaAnimationId)
                            animate()
                            document.querySelector('#user-interface').style.display = 'none'
                            gsap.to('#overlappingDiv', {
                                opacity: 0
                            })
                            
                            battle.initiated = false
                        }
                    })
                })
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

                    queue.push(() => {
                        // Fade back to black
                        gsap.to('#overlappingDiv', {
                            opacity: 1,
                            onComplete: () => {
                                window.cancelAnimationFrame(battleaAnimationId)
                                animate()
                                document.querySelector('#user-interface').style.display = 'none'
                                gsap.to('#overlappingDiv', {
                                    opacity: 0
                                })
                                
                                battle.initiated = false
                            }
                        })
                    })
                }
            })
        })

        button.addEventListener('mouseenter', (e) => {
            const selectedAttack = attacks[e.currentTarget.innerHTML]
            document.querySelector('#attack-type').innerHTML = selectedAttack.type
            document.querySelector('#attack-type').style.color = selectedAttack.color
        })
    })
}

// ---------------------------- Battle animation ----------------------------

function animateBattle(){
    battleaAnimationId = window.requestAnimationFrame(animateBattle)
    //console.log('animating battle');
    console.log(battleaAnimationId);
    battleBackground.draw()

    renderedSprites.forEach((sprite) => {
        sprite.draw()
    })
}

initBattle()
animateBattle()

document.querySelector('#dialogue-box').addEventListener('click', (e) => {
    if(queue.length > 0) {
        queue[0]()
        queue.shift()
    }else{
        e.currentTarget.style.display = 'none'
    }
})