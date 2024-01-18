enum SpriteKindLegacy {
    Player,
    Projectile,
    Food,
    Enemy
}
// Bottom row (not visible in first level).
scene.onHitTile(SpriteKindLegacy.Projectile, 3, function (sprite) {
    hitSprite = sprite
    scoreChange = 1
    rowHit = 3
    wallHit()
})
controller.anyButton.onEvent(ControllerButtonEvent.Pressed, function () {
    if (attractMode == 1) {
        startGame()
    }
})
function startGame () {
    currLevel = 1
    attractMode = 0
    startLevel()
}
function updateBall () {
    if (ball.y > ballMaxY) {
        info.changeLifeBy(-1)
        if (info.life() <= 0) {
            game.over(false, effects.melt)
        } else {
            music.wawawawaa.playUntilDone()
            pause(1000)
            resetPlayer()
            resetBall()
        }
    }
}
function initPlayer () {
    if (currLevel == 1) {
        player2 = sprites.create(img`
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            11111111111111111111111111111111
            11111111111111111111111111111111
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            `, SpriteKindLegacy.Player)
        player2.setFlag(SpriteFlag.StayInScreen, true)
        controller.moveSprite(player2, 100, 0)
        info.setScore(0)
        info.setLife(3)
    } else if (currLevel == 2) {
        player2.setImage(img`
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ....11111111111111111111111.....
            ....11111111111111111111111.....
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            `)
    } else {
        player2.setImage(img`
            ................
            ................
            ................
            ................
            ................
            ................
            ................
            ................
            ................
            ................
            ................
            ................
            ................
            ................
            ................
            1111111111111111
            1111111111111111
            ................
            ................
            ................
            ................
            ................
            ................
            ................
            ................
            ................
            ................
            ................
            ................
            ................
            ................
            ................
            `)
    }
    resetPlayer()
}
function createSplashBase () {
    splashBase = image.create(scene.screenWidth(), scene.screenHeight())
    splashBase.fill(15)
    currFont = drawStrings.createFontInfo(FontName.Font8, 3)
    drawStrings.writeCenter(
    "BREAKOUT!",
    splashBase,
    2,
    9,
    currFont
    )
    headlineY = drawStrings.height(currFont) + 4
    currFont = drawStrings.createFontInfo(FontName.Font8)
    levelText = "Can you survive " + winLevels + " levels?"
    drawStrings.writeCenter(
    levelText,
    splashBase,
    80,
    1,
    currFont
    )
    drawStrings.writeCenter(
    "Press any button to start",
    splashBase,
    scene.screenHeight() - (drawStrings.height(currFont) + 2),
    1,
    currFont
    )
}
function showSplashScreen () {
    splashScreensBuilt = 0
    createSplashBase()
    buildSplashScreens()
    currSplashScreen = 0
    splashRotateInterval = 5000
    nextSplashScreen = game.runtime() + splashRotateInterval
    scene.setBackgroundImage(splashScreens[0])
    splashScreensBuilt = 1
}
// Middle row (bottom row in first level).
scene.onHitTile(SpriteKindLegacy.Projectile, 2, function (sprite) {
    hitSprite = sprite
    if (currLevel == 1) {
        scoreChange = 1
    } else {
        scoreChange = 3
    }
    rowHit = 2
    wallHit()
})
sprites.onOverlap(SpriteKindLegacy.Player, SpriteKindLegacy.Projectile, function (sprite, otherSprite) {
    // If ball has already bounced, then ignore.
    if (ball.vy > 0) {
        xDiff = ball.x - player2.x
        ballVx = Math.abs(xDiff) * ballMaxVx / (player2.width / 2)
        ballVy = ballVx - ballCurrSpeed
        if (xDiff < 0) {
            ballVx = ballVx * -1
        }
        ball.setVelocity(ballVx, ballVy)
    }
})
function startAttractMode () {
    attractMode = 1
    showSplashScreen()
}
function initBall () {
    if (currLevel == 1) {
        ball = sprites.create(img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . 1 1 . . . . . . . 
            . . . . . . 1 1 1 1 . . . . . . 
            . . . . . 1 1 1 1 1 1 . . . . . 
            . . . . . 1 1 1 1 1 1 . . . . . 
            . . . . . . 1 1 1 1 . . . . . . 
            . . . . . . . 1 1 . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, SpriteKindLegacy.Projectile)
        ball.setFlag(SpriteFlag.BounceOnWall, true)
        ballInitSpeed = 50
        ballChangeSpeed = 25
        ballMaxVxFactor = 0.75
    } else if (currLevel == 2) {
        ballInitSpeed = 50
    } else {
        ballInitSpeed = 75
    }
    ballMaxVx = ballInitSpeed * ballMaxVxFactor
    ballCurrSpeed = ballInitSpeed
    // Maximum Y value for ball before ball is considered to be past the player
    ballMaxY = scene.screenHeight() - player2.height / 4
    resetBall()
}
function initScreen () {
    splashBase = image.create(scene.screenWidth(), scene.screenHeight())
    splashBase.fill(15)
    scene.setBackgroundImage(splashBase)
    scene.setTileMap(img`
        f f f f f f f f f f 
        f f f f f f f f f f 
        f f f f f f f f f f 
        f f f f f f f f f f 
        f f f f f f f f f f 
        f f f f f f f f f f 
        f f f f f f f f f f 
        f f f f f f f f f f 
        `)
    scene.setTile(15, img`
        f f f f f f f f f f f f f f f f 
        f f f f f f f f f f f f f f f f 
        f f f f f f f f f f f f f f f f 
        f f f f f f f f f f f f f f f f 
        f f f f f f f f f f f f f f f f 
        f f f f f f f f f f f f f f f f 
        f f f f f f f f f f f f f f f f 
        f f f f f f f f f f f f f f f f 
        f f f f f f f f f f f f f f f f 
        f f f f f f f f f f f f f f f f 
        f f f f f f f f f f f f f f f f 
        f f f f f f f f f f f f f f f f 
        f f f f f f f f f f f f f f f f 
        f f f f f f f f f f f f f f f f 
        f f f f f f f f f f f f f f f f 
        f f f f f f f f f f f f f f f f 
        `, false)
    scene.setTile(1, img`
        f f f f f f f f f f f f f f f f 
        f c e e e e e e e e e e e c f f 
        f e c e e e e e e e e e e e c f 
        f e e c c c c c c c c c c c c c 
        f e e c 4 4 4 4 4 4 4 4 4 4 4 4 
        f e e c 4 4 4 4 4 4 4 4 4 4 4 4 
        f e e c 4 4 4 4 4 4 4 4 4 4 4 4 
        f e e c 4 4 4 4 4 4 4 4 4 4 4 4 
        f e e c 4 4 4 4 4 4 4 4 4 4 4 4 
        f e e c 4 4 4 4 4 4 4 4 4 4 4 4 
        f e e c 4 4 4 4 4 4 4 4 4 4 4 4 
        f e e c 4 4 4 4 4 4 4 4 4 4 4 4 
        f e e c 4 4 4 4 4 4 4 4 4 4 4 4 
        f c e c 4 4 4 4 4 4 4 4 4 4 4 4 
        f f c c 4 4 4 4 4 4 4 4 4 4 4 4 
        f f f c 4 4 4 4 4 4 4 4 4 4 4 4 
        `, true)
    scene.setTile(2, img`
        f f f f f f f f f f f f f f f f 
        f c 6 6 6 6 6 6 6 6 6 6 6 c f f 
        f 6 c 6 6 6 6 6 6 6 6 6 6 6 c f 
        f 6 6 c c c c c c c c c c c c c 
        f 6 6 c 7 7 7 7 7 7 7 7 7 7 7 7 
        f 6 6 c 7 7 7 7 7 7 7 7 7 7 7 7 
        f 6 6 c 7 7 7 7 7 7 7 7 7 7 7 7 
        f 6 6 c 7 7 7 7 7 7 7 7 7 7 7 7 
        f 6 6 c 7 7 7 7 7 7 7 7 7 7 7 7 
        f 6 6 c 7 7 7 7 7 7 7 7 7 7 7 7 
        f 6 6 c 7 7 7 7 7 7 7 7 7 7 7 7 
        f 6 6 c 7 7 7 7 7 7 7 7 7 7 7 7 
        f 6 6 c 7 7 7 7 7 7 7 7 7 7 7 7 
        f c 6 c 7 7 7 7 7 7 7 7 7 7 7 7 
        f f c c 7 7 7 7 7 7 7 7 7 7 7 7 
        f f f c 7 7 7 7 7 7 7 7 7 7 7 7 
        `, true)
    scene.setTile(3, img`
        f f f f f f f f f f f f f f f f 
        f c 4 4 4 4 4 4 4 4 4 4 4 c f f 
        f 4 c 4 4 4 4 4 4 4 4 4 4 4 c f 
        f 4 4 c c c c c c c c c c c c c 
        f 4 4 c 5 5 5 5 5 5 5 5 5 5 5 5 
        f 4 4 c 5 5 5 5 5 5 5 5 5 5 5 5 
        f 4 4 c 5 5 5 5 5 5 5 5 5 5 5 5 
        f 4 4 c 5 5 5 5 5 5 5 5 5 5 5 5 
        f 4 4 c 5 5 5 5 5 5 5 5 5 5 5 5 
        f 4 4 c 5 5 5 5 5 5 5 5 5 5 5 5 
        f 4 4 c 5 5 5 5 5 5 5 5 5 5 5 5 
        f 4 4 c 5 5 5 5 5 5 5 5 5 5 5 5 
        f 4 4 c 5 5 5 5 5 5 5 5 5 5 5 5 
        f c 4 c 5 5 5 5 5 5 5 5 5 5 5 5 
        f f c c 5 5 5 5 5 5 5 5 5 5 5 5 
        f f f c 5 5 5 5 5 5 5 5 5 5 5 5 
        `, true)
    tileColumns = 10
    if (currLevel == 1) {
        tileRows = 2
    } else {
        tileRows = 3
    }
    totalBlocks = tileRows * tileColumns
    tileWidth = scene.screenWidth() / tileColumns
    for (let index = 0; index <= tileColumns - 1; index++) {
        scene.setTileAt(scene.getTile(index, 1), 1)
        scene.setTileAt(scene.getTile(index, 2), 2)
        if (currLevel > 1) {
            scene.setTileAt(scene.getTile(index, 3), 3)
        }
    }
}
function resetBall () {
    ball.setPosition(scene.screenWidth() / 2, scene.screenHeight() * 0.75)
    ballVx = 0
    ballVy = ballCurrSpeed - ballVx
    ball.setVelocity(ballVx, ballVy)
}
function buildSplashScreens () {
    headlines = [["Powered By Starcada"]]
    currFont = drawStrings.createFontInfo(FontName.Font5)
    splashScreens = []
    for (let value of headlines) {
        splashScreen = splashBase.clone()
        drawStrings.writeMultipleCenter(
        value,
        splashScreen,
        headlineY,
        14,
        currFont
        )
        splashScreens.push(splashScreen)
    }
}
function wallHit () {
    info.changeScoreBy(scoreChange)
    if (hitSprite.isHittingTile(CollisionDirection.Top)) {
        hitShift = 0
    } else if (hitSprite.isHittingTile(CollisionDirection.Bottom)) {
        hitShift = 0
    } else if (hitSprite.isHittingTile(CollisionDirection.Left)) {
        hitShift = -1
    } else {
        hitShift = 1
    }
    columnHit = Math.trunc(hitSprite.x / tileWidth) + hitShift
    scene.setTileAt(scene.getTile(columnHit, rowHit), 15)
    blockCount = scene.getTilesByType(1).length + (scene.getTilesByType(2).length + scene.getTilesByType(3).length)
    if (blockCount == 0) {
        if (currLevel < winLevels) {
            currLevel += 1
            music.powerUp.play()
            game.splash("Level Up!")
            startLevel()
        } else {
            game.over(true, effects.confetti)
        }
    } else {
        music.baDing.play()
        if (blockCount < totalBlocks / 2 && ballCurrSpeed == ballInitSpeed) {
            ballCurrSpeed += ballChangeSpeed
            ballMaxVx = ballCurrSpeed * ballMaxVxFactor
        }
    }
}
function resetPlayer () {
    player2.setPosition(scene.screenWidth() / 2, scene.screenHeight() - player2.height / 2)
}
function startLevel () {
    initScreen()
    initPlayer()
    initBall()
}
// Top row.
scene.onHitTile(SpriteKindLegacy.Projectile, 1, function (sprite) {
    hitSprite = sprite
    if (currLevel == 1) {
        scoreChange = 3
    } else {
        scoreChange = 5
    }
    rowHit = 1
    wallHit()
})
function rotateSplashScreen () {
    if (splashScreensBuilt == 1) {
        currSplashScreen += 1
        if (currSplashScreen >= splashScreens.length) {
            currSplashScreen = 0
        }
        scene.setBackgroundImage(splashScreens[currSplashScreen])
        nextSplashScreen = game.runtime() + splashRotateInterval
    }
}
let blockCount = 0
let columnHit = 0
let hitShift = 0
let splashScreen: Image = null
let headlines: string[][] = []
let tileWidth = 0
let totalBlocks = 0
let tileRows = 0
let tileColumns = 0
let ballMaxVxFactor = 0
let ballChangeSpeed = 0
let ballInitSpeed = 0
let ballCurrSpeed = 0
let ballVy = 0
let ballMaxVx = 0
let ballVx = 0
let xDiff = 0
let splashScreens: Image[] = []
let nextSplashScreen = 0
let splashRotateInterval = 0
let currSplashScreen = 0
let splashScreensBuilt = 0
let levelText = ""
let headlineY = 0
let currFont: FontInfo = null
let splashBase: Image = null
let player2: Sprite = null
let ballMaxY = 0
let ball: Sprite = null
let currLevel = 0
let attractMode = 0
let rowHit = 0
let scoreChange = 0
let hitSprite: Sprite = null
let winLevels = 0
winLevels = 4
startAttractMode()
game.onUpdate(function () {
    if (attractMode == 0) {
        updateBall()
    } else {
        if (game.runtime() >= nextSplashScreen) {
            rotateSplashScreen()
        }
    }
})
