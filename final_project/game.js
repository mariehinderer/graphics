var CANVAS_WIDTH = 500;
var CANVAS_HEIGHT = 500;
var enemies = [];
// var trumpPoints = 0;
var trumpObj;
var trumpxDir;
var trumpyDir;
var FPS = 30;
var Player1counter = 0;
var Player2counter = 0;


var canvasElement = $("<canvas width='" + CANVAS_WIDTH +"' height='" + CANVAS_HEIGHT + "'></canvas>");
var canvas = canvasElement.get(0).getContext("2d");
canvasElement.appendTo('body');

function collides(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

function handleCollisions() {
  enemies.forEach(function(enemy) {
    if (collides(enemy, Player)) {
      enemy.explode();
      Player1counter++;
    }
  });

  enemies.forEach(function(enemy) {
    if (collides(enemy, Player2)) {
      enemy.explode();
      Player2counter++;
    }
  });
}

function Enemy(I){
  I = I || {};
  I.active = true;
  I.age = Math.floor(Math.random() * 128);
  I.color = "#000";
  I.x = CANVAS_WIDTH / 4 + Math.random() * CANVAS_WIDTH / 2;
  I.y = 0;
  I.xVelocity = 0;
  I.yVelocity = 2;
  I.width = 32;
  I.height = 32;
  I.inBounds = function() {
    return I.x >= 0 && I.x <= CANVAS_WIDTH &&
      I.y >= 0 && I.y <= CANVAS_HEIGHT;
  };

  I.draw = function() {
    canvas.fillStyle = this.color;
    canvas.fillRect(this.x, this.y, 20 * Math.random() + 1, 20 * Math.random() + 1);

  };
  I.update = function() {
    I.x += I.xVelocity;
    I.y += I.yVelocity;
    I.xVelocity = 3 * Math.sin(I.age * Math.PI / 64);
    I.active = I.active && I.inBounds();
    
  };

  I.explode = function(){
    this.active = false;
  }

  return I;

}





// var enemy = function(x,y){
//   this.color="#000";
//   this.active = true;
//   this.x = x;
//   this.y = y;
//   this.width = 32;
//   this.height = 32;
//   this.draw = function(){
//     canvas.fillStyle = this.color;
//     canvas.fillRect(this.x,this.y,this.width,this.height)
//   }
//   this.move = function(){
//     this.y += Math.random()*50;
//     this.x += Math.random()*3;
//
//     if(this.x > CANVAS_WIDTH){
//       this.x = 0;
//     }
//
//     if(this.x < 0){
//       this.x = Math.random(CANVAS_WIDTH);
//     }
//
//     if(this.y > CANVAS_HEIGHT){
//       this.y = 0;
//     }
//
//     if(this.y < 0){
//       this.y = Math.random(-500,0);
//     }
//   }
// }
//
// for(var i = 0; i < 50; i++){
//   votes.push(new enemy(Math.random() * 500, 0));
// }



setInterval(function(){
  update();
  draw();
}, 1000/FPS);


function draw(){
  canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  canvas.fillStyle = "#ebf4ec";
  canvas.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
  canvas.fillStyle = "#FF4500";
  canvas.fillText("Player 1 has collected: " + Player1counter, 50,50);
  canvas.fillText("Player 2 has collected: " + Player2counter, 50,75);

  Player.draw();
  Player2.draw();

  enemies.forEach(function(enemy) {
    enemy.draw();
  });

  // if(Player.x > CANVAS_WIDTH){
  //   Player.x = 0;
  // }
  //
  // if(Player.x < 0){
  //   Player.x = CAVAS_WIDTH;
  // }
  //
  // if(Player.y > CANVAS_HEIGHT){
  //   Player.y = 0;
  // }
  //
  // if(Player.y < 0){
  //   Player.y = CANVAS_HEIGHT;
  // }
  //
  // if(Player2.x > CANVAS_WIDTH){
  //   Player.x = 0;
  // }
  //
  // if(Player2.x < 0){
  //   Player.x = CAVAS_WIDTH;
  // }
  //
  // if(Player2.y > CANVAS_HEIGHT){
  //   Player.y = 0;
  // }
  //
  // if(Player2.y < 0){
  //   Player.y = CANVAS_HEIGHT;
  // }

}



function update(){

  // if(Player.x > CANVAS_WIDTH){
  //   Player.x = 0;
  // }
  //
  // if(Player.x < 0){
  //   Player.x = CAVAS_WIDTH;
  // }
  //
  // if(Player.y > CANVAS_HEIGHT){
  //   Player.y = 0;
  // }
  //
  // if(Player.y < 0){
  //   Player.y = CANVAS_HEIGHT;
  // }
  //
  // if(Player2.x > CANVAS_WIDTH){
  //   Player.x = 0;
  // }
  //
  // if(Player2.x < 0){
  //   Player.x = CAVAS_WIDTH;
  // }
  //
  // if(Player2.y > CANVAS_HEIGHT){
  //   Player.y = 0;
  // }
  //
  // if(Player2.y < 0){
  //   Player.y = CANVAS_HEIGHT;
  // }



  handleCollisions();

  enemies.forEach(function(enemy){
    enemy.update();
  });

  enemies = enemies.filter(function(enemy){
    return enemy.active;
  })

  if(Math.random() < .1){
    enemies.push(Enemy());
  }

  if(keydown.left){
    Player.x -= 8;
  }

  if(keydown.right){
    Player.x += 8;
  }

  if(keydown.up){
    Player.y -= 8;
  }

  if(keydown.down){
    Player.y += 8;
  }

  if(keydown.aKey){
    Player2.x -= 8;
  }

  if(keydown.dKey){
    Player2.x += 8;
  }

  if(keydown.wKey){
    Player2.y -= 8;
  }

  if(keydown.sKey){
    Player2.y += 8;
  }

  // Player.x += 1;
}

var Player = {
  color: "red",
  x: 250,
  y: 400,
  width: 32,
  height: 32,
  draw: function(){
    canvas.fillStyle = this.color;
    canvas.fillRect(this.x, this.y, this.width, this.height);
    if(this.x < 0){
      this.x = CANVAS_WIDTH;
    }
    if(this.x > CANVAS_WIDTH){
      this.x = 0;
    }
    if(this.y > CANVAS_HEIGHT){
      this.y = 0;
    }
    if(this.y < 0){
      this.y = CANVAS_HEIGHT;
    }
  }
}

var Player2 = {
  color: "green",
  x: 200,
  y: 400,
  width: 32,
  height: 32,
  draw: function(){
    canvas.fillStyle = this.color;
    canvas.fillRect(this.x, this.y, this.width, this.height);

    if(this.x < 0){
      this.x = CANVAS_WIDTH;
    }
    if(this.x > CANVAS_WIDTH){
      this.x = 0;
    }
    if(this.y > CANVAS_HEIGHT){
      this.y = 0;
    }
    if(this.y < 0){
      this.y = CANVAS_HEIGHT;
    }
  }
}
