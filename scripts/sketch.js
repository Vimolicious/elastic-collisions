let paused = true;

const wallX = 0;

let blockA;
let blockB;

const blockASize = 100;

let count = 0;
let digits = 1;
let digistDiv;
let timeSteps;

let pauseButton;
let digitsSlider;
let showCountCheckbox;

let clackSound;

function preload() {
  clackSound = loadSound('../assets/clack.wav');
}

function setup() {
  // confirm('Allow sounds');
  const c = createCanvas(max(innerWidth - 100, 800), 800);
  c.parent('canvas-container');

  pauseButton = createButton('Play');
  pauseButton.parent('controls');
  pauseButton.id('play-pause-btn');
  pauseButton.mousePressed(() => {
    paused = !paused;
    select('#play-pause-btn').html(paused ? 'Play' : 'Pause');
  });

  digitsDiv = createDiv(0);
  digitsDiv.parent('controls');
  digitsDiv.id('digits');

  digitsSlider = createSlider(1, 8, 1, 1);
  digitsSlider.parent('controls');

  showCountCheckbox = createCheckbox('Show collision count');
  showCountCheckbox.parent('controls');

  makeBlocks();
}

function makeBlocks() {
  count = 0;

  blockA = new Block(150, blockASize, 1, 0, 0);
  blockB = new Block(
    400,
    min(500, blockASize * digits), // Size
    100 ** (digits - 1), // Mass of blockB
    -1,
    blockASize
  );
}

function draw() {
  if (digits != digitsSlider.value()) {
    digits = digitsSlider.value();
    makeBlocks();
  }

  background(0);

  while (!paused) {
    blockA.update();
    blockB.update();

    const hitsWall = blockA.hitsWall();

    if (hitsWall || blockA.collidesWith(blockB)) {
      blockA.x -= blockA.vel;
      blockB.x -= blockB.vel;

      if (hitsWall) {
        blockA.reverse();
      } else {
        const v1 = blockA.bounceOff(blockB);
        const v2 = blockB.bounceOff(blockA);

        blockA.vel = v1;
        blockB.vel = v2;
      }
      if (!clackSound.isPlaying()) {
        clackSound.play();
      }
      count++;
    } else {
      break;
    }
  }

  stroke(250);
  strokeWeight(3);
  line(1, 0, 1, height);
  line(1, height - 1, width, height - 1);

  blockA.show();
  blockB.show();

  const digitsDisplay = `${100 ** (digits - 1)} times the mass`;
  if (digitsDiv.elt.innerHTML != digitsDisplay) {
    digitsDiv.html(digitsDisplay);
  }

  // const countDiv = select('#collision-count');
  // if (countDiv.elt.innerHTML !== count) {
  //   countDiv.html(`#Collisions: ${count}`);
  // }

  textAlign(LEFT);
  if (showCountCheckbox.checked()) {
    fill(255);
    textSize(80);
    textFont('system-ui');
    text(`#Collisions: ${count}`, 100, 200);
  }
}

function windowResized() {
  resizeCanvas(max(innerWidth - 100, 800), 800);
}
