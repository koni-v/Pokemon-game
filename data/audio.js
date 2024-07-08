// ----------------------------- Audio Object -----------------------------
// Define the audio files used in the game and their settings
const audio = {
    Map: new Howl({
        src: './audio/map.wav',
        html5: true, // The audio won't play without this because the game is not on a local server
        volume: 0.1
    }),
    InitBattle: new Howl({
        src: './audio/initBattle.wav',
        html5: true,
        volume: 0.03
    }),
    Battle: new Howl({
        src: './audio/battle.mp3',
        html5: true,
        volume: 0.1
    }),
    TackleHit: new Howl({
        src: './audio/tackleHit.wav',
        html5: true,
        volume: 0.1
    }),
    FireballHit: new Howl({
        src: './audio/fireballHit.wav',
        html5: true,
        volume: 0.1
    }),
    InitFireball: new Howl({
        src: './audio/initFireball.wav',
        html5: true,
        volume: 0.1
    }),
    Victory: new Howl({
        src: './audio/victory.wav',
        html5: true,
        volume: 0.2
    })
    
}