var LOADING = 0;
var START = 1;
var PLAY = 2;
var END = 3;
var WIN = 4;
var ENDING = 5;

var gameState = LOADING;
var ground,groundImg;
var sonic,sonicImg,jumpImg,deadImg;
var invisibleGround;
var monster,monsterImg;
var rock,rockImg;
var fire,fireImg;
var net,netImg;
var coin,coinImg;
var treasure=0;
var score=0;
var img,loadingImg,startImg;
var gameOver,gameOverImg;
var block,block2,block3;
var coinSound;
var startSound;
var playSound;
var heading,headingImg;

function preload(){
  groundImg=loadImage("forest.jpg");
  sonicImg=loadImage("sonic.gif");
  jumpImg=loadImage("sonic_jump.png");
  deadImg=loadImage("dead.png");
  rockImg=loadImage("rock.png");
  fireImg=loadImage("fire.gif");
  netImg=loadImage("net.png");
  loadingImg=loadImage("loading.jpg");
  startImg=loadImage("menu.jpg");
  coinImg=loadImage("coin.gif");
  coinSound = loadSound("WhatsApp Audio 2021-03-21 at 4.51.23 PM.aac");
  startSound=loadSound("Temple-Run-Running-Theme.mp3");
  monsterImg=loadImage("villian.gif");
  gameOverImg=loadImage("game over.png");
  playSound=loadSound("02 Green Hill Zone.mp3");

  overSound=loadSound("gameOver.mp3");
  end=loadSound("End.mp3");
  ending=loadSound("Ending.mp3");
  blast=loadImage("blast.gif");
  dance=loadImage("dancing.gif");
  happy=loadImage("sonic happy.png");
  walk=loadImage("sonic walk.gif");
  castle=loadImage("sonic_castle.jpg");
  credits=loadSound("Sonic.mp3");
  headingImg=loadImage("you win.png");
}

function setup(){
  createCanvas(900, 500);
  ground=createSprite(400,250);
  ground.addImage(groundImg);
  ground.scale=1.2;
  
  sonic=createSprite(240,350);
  sonic.addImage(sonicImg);
  sonic.scale=0.18;
  sonic.debug=false;
  sonic.visible=false;
  invisibleGround=createSprite(450,415,900,5);
  invisibleGround.visible=false;
  
  block=createSprite(450,325,150,150);
  block.visible=false;
  
  img=createSprite(450,250);
  img.scale=0.5;
  img.visible=false;
  
  monster=createSprite(100,320);
  monster.addImage(monsterImg);
  monster.scale=0.5;
  monster.visible=false;
  
  gameOver=createSprite(450,250);
  gameOver.addImage(gameOverImg);
  gameOver.scale=0.8;
  gameOver.visible=false;
  
  block2=createSprite(355,450,90,40);
  block2.visible=false;
  
  block3=createSprite(550,450,90,40);
  block3.visible=false;

  block4=createSprite(0,-250,10,10);

  block5=createSprite(1370,250,10,10);
  block5.addImage(castle);
  block5.scale=1.5
  block5.visible=false;
  sonic.depth=block5.depth;
  sonic.depth=block5.depth+1;

  heading=createSprite(450,250,10,10);
  heading.addImage(headingImg);
  heading.scale=0.5;
  heading.visible=false;
  
  rockGroup = new Group();
  fireGroup = new Group();
  netGroup = new Group();
  coinGroup = new Group();
}

function draw(){
  background("grey");
  camera.position.x = sonic.x+210;
  //console.log(windowWidth);
  
  if(gameState==LOADING){
  img.addImage(loadingImg);  
  img.visible=true;
  if(frameCount % 200 === 0) {
  gameState=START;
  startSound.play();
  }
  }
  if(gameState==START){
  img.addImage(startImg);
  sonic.visible=false;
  img.scale=0.47;  
  monster.visible=false;  
  if(mousePressedOver(block)) {
    gameState=PLAY;
    playSound.play();
  }  
  }
  if(gameState==PLAY){
  sonic.visible=true;
  ground.velocityX=-(3 + score/100);
  startSound.stop();
  camera.position.y = sonic.y-120;
  img.visible=false;
  monster.visible=true;  
  if (ground.x < 310){
  ground.x = ground.x=400;
  }
  if(keyDown("space") && sonic.y>= 330) {
      sonic.velocityY = -16;
  }
  sonic.velocityY = sonic.velocityY + 0.8;
  sonic.collide(invisibleGround);
  score = score + Math.round(getFrameRate()/60);
   if(frameCount % 140 === 0) {
  var obstacle = Math.round(random(1,3));
    switch(obstacle) {
      case 1: spawnRock();
              break;
      case 2:spawnFire();
              break;
      case 3: spawnNet();
              break;

      default: break;
    }
   }
     spawnCoin(); 
  if(rockGroup.isTouching(sonic)){
    sonic.addImage(deadImg);
    gameState=END;
    rockGroup.setVelocityXEach(0);
    rockGroup.setLifetimeEach(-1);
    fireGroup.destroyEach();
    netGroup.destroyEach();
    coinGroup.destroyEach();
    overSound.play();
  }  
  if(fireGroup.isTouching(sonic)){
    sonic.addImage(deadImg);
    gameState=END;
    fireGroup.setVelocityXEach(0);
    fireGroup.setLifetimeEach(-1);
    rockGroup.destroyEach();
    netGroup.destroyEach();
    coinGroup.destroyEach();
    overSound.play();
  }  
  if(netGroup.isTouching(sonic)){
    sonic.addImage(deadImg);
    gameState=END;
    netGroup.setVelocityXEach(0);
    netGroup.setLifetimeEach(-1);
    rockGroup.destroyEach();
    fireGroup.destroyEach();
    coinGroup.destroyEach();
    overSound.play();
  }    

  if(treasure==10){
    playSound.stop();
    gameState=WIN;
    end.play();
    ground.velocityX=0;
    monster.addImage(blast);
    sonic.addImage(happy);
    block4.velocityX=1;
    sonic.scale=0.11;
    sonic.velocityY=0;
    netGroup.destroyEach();
    rockGroup.destroyEach();
    fireGroup.destroyEach();
    coinGroup.destroyEach();
    ground.x=-250;
  }
  }
  if(gameState==WIN){
      if(block4.x==200){
      monster.destroy();
      sonic.scale=0.8;
      block4.velocityX=0;
      ground.velocityX=-2;
      block5.visible=true;
      block5.velocityX=-2;
      sonic.addImage(walk);
      if(block4.x==200){
        ending.play();
        block4.x=201;
      }
      }
      if(block5.x==450){
        ending.stop();
        credits.play();
        gameState=ENDING;
      }
  }
  if(gameState==ENDING){
      block5.velocityX=0;
      ground.velocityX=0;
      sonic.addImage(dance);
      sonic.scale=0.6;
      sonic.y=390;
      heading.visible=true;
  }
  if(gameState==END){
    //sonic.visible=false;
    playSound.stop();
    camera.position.y = 250;
    ground.velocityX=0;
    sonic.velocityX=0;
    sonic.velocityY=0;
    sonic.scale=0.09;
    if(gameOver.visible==false){
      sonic.visible=true
    }
    if(frameCount % 100 === 0) {
      gameOver.visible=true;
    }
      if(mousePressedOver(block2)){
        gameOver.visible=false;
        gameState=START;
        startSound.play();
        img.visible=true;
        rockGroup.destroyEach();
        fireGroup.destroyEach();
        netGroup.destroyEach();
        sonic.addImage(sonicImg);
        sonic.scale=0.18;
        ground.velocityX=-(3 + score/100);
        treasure=0
        score=0;
      }
     if(mousePressedOver(block3)){
       gameOver.visible=false;
     }
  }

  
  
  drawSprites();
  //text(mouseX+","+mouseY,mouseX,mouseY);
  textSize(20);
  fill("yellow");
  text("Score: "+ score, 750,40);
  textSize(20);
  fill("yellow");
  text("Ring: "+ treasure, 40,40);
}

function spawnRock(){
  rock=createSprite(1000,380);
  rock.addImage(rockImg);
  rock.scale=0.25;
  rock.velocityX=-(5 + score/100);
  rock.lifetime=280;
  rockGroup.add(rock);
  rock.debug=false;
  rock.setCollider("rectangle",0,0,400,200);
  gameOver.depth = rock.depth;
  gameOver.depth = gameOver.depth + 1;
}

function spawnFire(){
  fire=createSprite(1000,370);
  fire.addImage(fireImg);
  fire.scale=0.18;
  fire.velocityX=-(5 + score/100);
  fire.lifetime=285;
  fireGroup.add(fire);
  fire.debug=false;
  fire.setCollider("rectangle",0,0,300,380);
  gameOver.depth = fire.depth;
  gameOver.depth = gameOver.depth + 1;
  
}

function spawnNet(){
  net=createSprite(1000,380);
  net.addImage(netImg);
  net.scale=0.05;
  net.velocityX=-(5 + score/100); 
  net.lifetime=280;
  netGroup.add(net);
  net.debug=false;
  net.setCollider("circle",0,0,650);
  gameOver.depth = net.depth;
  gameOver.depth = gameOver.depth + 1;
}

function spawnCoin(){
  if(frameCount % 25 === 0){
  coin=createSprite(1000,380);
  coin.addImage(coinImg);
  coin.scale=0.2;
  coin.velocityX=-5;
  coin.lifetime=280;  
  coinGroup.add(coin);
  if(coinGroup.isTouching(sonic)){
    coinGroup.destroyEach();
    coinSound.play();
    treasure=treasure+1;
  }  
  }
}





