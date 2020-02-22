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
    500,
    min(500, blockASize * digits), // Size
    100 ** (digits - 1), // Mass of blockB
    -2,
    blockASize
  );
}

function draw() {
  if (digits != digitsSlider.value()) {
    digits = digitsSlider.value();
    makeBlocks();
    paused = true;
    select('#play-pause-btn').html(paused ? 'Play' : 'Pause');
  }

  background(0);

  while (!paused) {
    blockA.update();
    blockB.update();

    const hitsWall = blockA.hitsWall();

    if (hitsWall || blockA.collidesWith(blockB)) {
      // If either block has a collision, move them back so they aren't
      blockA.x -= blockA.vel;
      blockB.x -= blockB.vel;

      // If the collision was block A hitting the wall
      if (hitsWall) {
        // Flip it's velocity around
        blockA.reverse();
      } else {
        // Otherwise, calculate the new velocities of the blocks using the law of conservation of momentum
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

  const digitsDisplay = `${
    digits > 1 ? `1E+${2 * (digits - 1)} times the` : 'They have the same'
  } mass`;
  if (digitsDiv.elt.innerHTML != digitsDisplay) {
    digitsDiv.html(digitsDisplay);
  }

  textAlign(LEFT, CENTER);
  if (showCountCheckbox.checked()) {
    fill(255);
    textSize(80);
    textFont('system-ui');
    text(`#Collisions: ${count}`, 100, 115);
  }
}

function windowResized() {
  resizeCanvas(max(innerWidth - 100, 800), 800);
}
