
var canvas = document.querySelector('#game');
var ctx = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 650;
var keydown = [];
var terrainGrass = new Image();
var terrainPlayer = new Image();
var terrainBox = new Image();
textureSkeleton = new Image();
terrainPlayer.src = 'knight.png';
terrainBox.src = 'box.jpg';
terrainGrass.src = 'terrain.jpg';
textureSkeleton.src = 'skeleton.png';
terrainGrass.onload = renderGame;
typeTexture = [{ image: terrainGrass }, { image: terrainBox }];
var map = [{ x: 0, y: 120, typeTexture: 0, width: 200, height: 30 }, { x: 320, y: 120, typeTexture: 0, width: 200, height: 30 }, { x: 120, y: 50, typeTexture: 0, width: 200, height: 30 }, { x: 180, y: 30, typeTexture: 1, width: 30, height: 20 }];
class Character {
  speed = 5;
  grav = 2;
  xPos = 0;
  yPos = 0;
  sizeX = 30;
  sizeY = 30;
  stopRight = false;
  stopLeft = false;
  stopJump = false;
  rowPlayerSprite = 11;
  numAnim = 1;
  changeSprite() {
    if (this.numAnim <= 7) {
      this.numAnim++;
    }
    else {
      this.numAnim = 1;
    }
  }
  checkCollision() {
    for (let i = 0; i < map.length; i++) {
      if (this.yPos >= map[i].y - this.sizeY && this.yPos <= map[i].y + map[i].height && this.xPos >= map[i].x - this.sizeX && this.xPos <= map[i].x + map[i].width) {
        if (map[i].typeTexture === 1 || map[i].typeTexture === 0) {
          this.grav = 0;
        }
        break;
      }
      else {
        this.grav = 5;
      }
    }
  }
  checkCollisionObj() {
    for (let i = 0; i < map.length; i++) {
      if (this.xPos + this.sizeX >= map[i].x && this.xPos + this.sizeX <= map[i].x + 5 && this.yPos + this.sizeY === map[i].y + map[i].height) {
        this.stopRight = true;
      }
      if (this.xPos >= map[i].x + map[i].width && this.xPos - 5 <= map[i].x + map[i].width && this.yPos + this.sizeY === map[i].y + map[i].height) {
        this.stopLeft = true;
      }
      if (this.yPos - Player.sizeY === map[i].y - map[i].height) {
        console.log(1);
      }
    }
  }
}

var Player = new Character();
var enemyLevel = [];
Player.xPos = 180;
Player.yPos = 0;
function addEnemyLevelOnLevel(xPos, yPos) {
  var enemy = new Character();
  enemy.xPos = xPos;
  enemy.yPos = yPos;
  enemy.speed = 1;
  enemy.checkTouchPlayer = function () {
    if (Player.yPos >= this.yPos - Player.sizeY && Player.yPos <= this.yPos + this.sizeY && Player.xPos >= this.xPos - Player.sizeX && Player.xPos <= this.xPos + this.sizeX) {
      console.log(1);
    }
  }
  enemy.playerFound = false;
  enemy.moveAI = function () {
    this.yPos += this.grav;
     //Патрулирование ai
    if(!this.playerFound){
    for (let i = 0; i < map.length; i++) {
      if (map[i].typeTexture === 0) {
      if ((this.xPos >= map[i].x + map[i].width - this.sizeX || this.xPos <= map[i].x ) ) {
          if (this.speed < 0) {
            this.rowPlayerSprite = 11;
          }
          else {
            this.rowPlayerSprite = 9;
          }
          this.speed = this.speed * -1;
        }
      }
      }
      this.xPos += this.speed;
      }
       //Обнаружение ai героя
      if(Math.abs(Player.xPos - this.xPos) < 100 && Math.abs(Player.yPos - this.yPos) < 40){
        this.playerFound = true;
        if(this.xPos !== Player.xPos){
          if(this.xPos > Player.xPos){
          this.xPos -= 1;
          this.rowPlayerSprite = 9;
          }
          else{
            this.xPos += 1;
            this.rowPlayerSprite = 11;
          }
        }
        else{
          if(this.yPos > Player.yPos){
            this.yPos -= 3;
          }
          this.xPos -= 0;
        }
      }
      else{
        this.playerFound = false;
      }
    }
  enemyLevel.push(enemy);
}
addEnemyLevelOnLevel(400, 55);
addEnemyLevelOnLevel(220, 15);


function renderGame() {
  for (let i = 0; i < map.length; i++) {
    ctx.drawImage(typeTexture[map[i].typeTexture].image, map[i].x, map[i].y, map[i].width, map[i].height);
  }
  ctx.drawImage(terrainPlayer, 15 + Player.numAnim * 64, 0 + Player.rowPlayerSprite * 65, Player.sizeX + 10, Player.sizeY + 20, Player.xPos, Player.yPos, Player.sizeX, Player.sizeY);
}
document.addEventListener('keydown', controllerPlayer);

function playerMotion(rightMotion) {
  if (rightMotion) {
    if (!Player.stopRight) {
      Player.xPos += 1;
    }
    else {
      Player.xPos += 0;
    }
  }
  else {
    if (!Player.stopLeft) {
      Player.xPos -= 1;
    }
    else {
      Player.xPos -= 0;
    }
  }
}
function controllerPlayer(e) {
  if (keydown.indexOf(e.keyCode) === -1) {
    keydown.push(e.keyCode);
  }
  if (keydown.indexOf(37) !== -1) {
    playerMotion(false);
    playerMotion(false);
    playerMotion(false);

    Player.stopLeft = false;
    Player.rowPlayerSprite = 9;
    Player.changeSprite();
  }
  if (keydown.indexOf(39) !== -1) {
    playerMotion(true);
    playerMotion(true);
    playerMotion(true);


    Player.stopRight = false;
    Player.rowPlayerSprite = 11;
    Player.changeSprite();
  }


  if (keydown.indexOf(38) !== -1) {
 
      Player.yPos -= 15;
      Player.yPos -= 15;
      Player.yPos -= 15;
      Player.yPos -= 15;
  }
}

document.addEventListener('keyup', function (e) {
  Player.numAnim = 0;
  keydown = [];
});
function renderPosAI() {
  for (let i = 0; i < enemyLevel.length; i++) {
    enemyLevel[i].checkTouchPlayer();
    enemyLevel[i].checkCollision();
    enemyLevel[i].moveAI();
    enemyLevel[i].changeSprite();
    ctx.drawImage(textureSkeleton, 15 + enemyLevel[i].numAnim * 64, 0 + enemyLevel[i].rowPlayerSprite * 65, enemyLevel[i].sizeX + 10, enemyLevel[i].sizeY + 20, enemyLevel[i].xPos, enemyLevel[i].yPos, enemyLevel[i].sizeX, enemyLevel[i].sizeY);
  }
}
renderGame();
setInterval(function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  renderGame();
  Player.checkCollision();
  Player.checkCollisionObj();
  renderPosAI();
  Player.yPos += Player.grav;
}, 1000/60);

