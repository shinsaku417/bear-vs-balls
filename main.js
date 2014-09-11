enchant();

window.onload = function() {

  var core = new Core(640, 480);
  // Preload images so I can use it
  core.preload('chara1.png');
  core.preload('ball.png');
  core.preload('powerup.png');
  core.preload('small.png');
  core.preload('bg.png');
  core.preload('bgm.wav');
  core.preload('fast.wav');
  core.preload('end.wav');
  core.preload('small.mp3');
  core.fps = 15;
  core.onload = function() {

    core.bgm = core.assets['bgm.wav'];
    core.bgm.play();

    var bg = new Sprite(640, 480);
    bg.image = core.assets['bg.png'];
    core.rootScene.addChild(bg);

    var isGameover = false;

    var Bear = Class.create(Sprite, {
      initialize: function(x, y) {
        Sprite.call(this, 32, 32);
        this.x = x;
        this.y = y;
        this.scale(2,2);
        this.count = 0;
        this.frame = this.count;
        this.powerup = 0;
        this.image = core.assets['chara1.png'];

        this.addEventListener('enterframe', function() {
          if (!isGameover) {
            if (core.input.left && this.x > 0 + this.powerup) {
              this.x -= 10 + this.powerup;
              this.count++;
              this.frame = this.count % 3;
            }
            if (core.input.right && this.x < 640 - this.powerup) {
              this.x += 10 + this.powerup;
              this.count++;
              this.frame = this.count % 3;
            }
            if (core.input.up && this.y > 10 + this.powerup) {
             this.y -= 10 + this.powerup;
             this.count++;
             this.frame = this.count % 3;
            }
            if (core.input.down && this.y < 430 - this.powerup) {
             this.y += 10 + this.powerup;
             this.count++;
             this.frame = this.count % 3;
            }
         }
        });

        core.rootScene.addChild(this);
      }
    });

    var Ball = Class.create(Sprite, {
      initialize: function(x, y) {
        Sprite.call(this, 16, 16);
        this.x = x;
        this.y = y;
        this.speedX = rand(10) + 2;
        this.speedY = rand(10) + 2;
        if (rand(1) == 1) {
          this.left = true;
        } else {
          this.left = false;
        }
        if (rand(1) == 1) {
          this.down = true;
        } else {
          this.down = false;
        }
        this.image = core.assets['ball.png'];

        this.addEventListener('enterframe', function() {
          if (!isGameover) {
          if (this.left) {
            this.x -= this.speedX;
          } else {
            this.x += this.speedX;
          }
          if (this.down) {
            this.y += this.speedY;
          } else {
            this.y -= this.speedY;
          }

          if (this.x > 620) {
            this.left = true;
          }
          if (this.x < 0) {
            this.left = false;
          }
          if (this.y > 460) {
            this.down = false;
          }
          if (this.y < 0) {
            this.down = true;
          }

          if (this.within(bear, (bear.scaleX * bear.width) / 2)) {
            core.bgm.stop();
            core.assets['end.wav'].play();

            isGameover = true;
            clearInterval(interval);
            clearInterval(powerupInterval);
            bear.opacity = 0.5;

            var highscore = localStorage.getItem('highscore');
            if (highscore === null || score > parseFloat(highscore)) {
              localStorage.setItem('highscore', score);
            }

            var gameover = new Label();
            gameover.x = 180;
            gameover.y = 80;
            gameover.color = 'blue';
            gameover.font = '48px "Arial"';
            gameover.text = "GAME OVER";
            core.rootScene.addChild(gameover);

            var myScoreLabel = new Label();
            myScoreLabel.x = 220;
            myScoreLabel.y = 160;
            myScoreLabel.color = 'blue';
            myScoreLabel.font = '28px "Arial"';
            myScoreLabel.text = "Your Score: " + score;
            core.rootScene.addChild(myScoreLabel);

            var highscoreLabel = new Label();
            highscoreLabel.x = 200;
            highscoreLabel.y = 240;
            highscoreLabel.color = 'blue';
            highscoreLabel.font = '28px "Arial"';
            highscoreLabel.text = "Your Highscore: " + localStorage.getItem('highscore');
            core.rootScene.addChild(highscoreLabel);

            var restartLabel = new Label();
            restartLabel.x = 220;
            restartLabel.y = 320;
            restartLabel.color = 'blue';
            restartLabel.font = '28px "Arial"';
            restartLabel.text = "Click To Restart";
            core.rootScene.addChild(restartLabel);
          }
        }
        });

        core.rootScene.addChild(this);
      }
    });

    var Powerup = Class.create(Sprite, {
      initialize: function(x, y) {
        Sprite.call(this, 16, 16);
        this.x = x;
        this.y = y;
        this.speedX = rand(10) + 3;
        this.speedY = rand(10) + 3;
        if (rand(1) == 1) {
          this.left = true;
        } else {
          this.left = false;
        }

        // Fast => green ball, speeds up the bear
        if (rand(1) == 1) {
          this.fast = true;
        } else {
          this.fast = false;
        }
        if (this.fast) {
          this.image = core.assets['powerup.png'];
        } else {
          this.image = core.assets['small.png'];
        }

        this.addEventListener('enterframe', function() {
          if (!isGameover) {
            if (this.left) {
              this.x -= this.speedX;
            } else {
              this.x += this.speedX;
            }
          this.y += this.speedY;

          if (this.x > 620) {
            this.left = true;
          } else if (this.x < 0) {
            this.left = false;
          }

          if (this.y > 500) {
            core.rootScene.removeChild(this);
          }

          if (this.within(bear, (bear.scaleX * bear.width) / 2 + 8)) {
            if (this.fast) {
              core.assets['fast.wav'].play();
              bear.powerup += 2;
            } else {
              core.assets['small.mp3'].play();
              bear.scale(0.95, 0.95);
            }
            core.rootScene.removeChild(this);
          }
        }
        });

        core.rootScene.addChild(this);
      }
    });

    var bear = new Bear(300, 300);
    var ballOne = new Ball(640, 0);
    var ballTwo = new Ball(0, 480);
    var ballThree = new Ball(0, 0);
    var ballFour = new Ball(640, 480);

    var label = new Label();
    var score = 0;
    label.x = 500;
    label.y = 10;
    label.color = 'red';
    label.font = '28px "Arial"';
    label.text = '0';
    label.on('enterframe', function() {
      if (!isGameover) {
      label.text = (core.frame / core.fps).toFixed(2);
      score = (core.frame / core.fps).toFixed(2);
    }
    });
    core.rootScene.addChild(label);

    var restart = function(e) {
      if (isGameover) {
        location.reload();
      }
    };
    core.rootScene.addEventListener('touchstart', restart);

    var balls = [];
    var ballCount = 0;
    var powerups = [];
    var powerupCount = 0;
    var interval = setInterval(function() {
      balls[ballCount] = new Ball(rand(640),0);
      ballCount++;
    }, 4000);
    var powerupInterval = setInterval(function() {
      powerups[powerupCount] = new Powerup(rand(640), 0);
      powerupCount++;
    }, 5000);

  };
  core.start();

};

function rand(n) {
  return Math.floor(Math.random() * (n+1));
}
