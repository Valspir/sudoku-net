var sq = [];
var score = 0;
var gNB;
var aiM;
var gWS
var oldPos = 0;
let d = new Date();
var idleTime = d.getTime();
var rB;
var hitWall = 0;
var timeScale = 1;
var pf = require('./pathFinder')
var brain = require('./brain')
////document.addEventListener('DOMContentLoaded', () => {

  //const scoreDisplay = //document.getElementById('score')
  const width = 28
  //let score = 0
  //const grid = //document.querySelector('.grid')*/

  const layout = [
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
    1,3,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,3,1,
    1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,4,4,4,4,4,4,4,4,4,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,1,1,1,2,2,1,1,1,4,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,1,
    4,4,4,4,4,4,0,0,0,4,1,2,2,2,2,2,2,1,4,0,0,0,4,4,4,4,4,4,
    1,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
    1,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
    1,3,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,3,1,
    1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
    1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
    1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1,
    1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
    1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
  ]
  // 0 - pac-dots
  // 1 - wall
  // 2 - ghost-lair
  // 3 - power-pellet
  // 4 - empty

  var squares = []
  sq = squares;
  rB = resetBoard;

  //create your board
  function createBoard() {
    for (let i = 0; i < layout.length; i++) {
      //const square = //document.createElement('div')
      //grid.appendChild(square)
      //
      var square=[]

      //add layout to the board
      if(layout[i] === 0) {
        square.push('pac-dot')
      } else if (layout[i] === 1) {
        square.push('wall')
      } else if (layout[i] === 2) {
        square.push('ghost-lair')
      } else if (layout[i] === 3) {
        square.push('power-pellet')
      }
      squares.push(square)
    }
    //squares.splice(784,squares.length);

  }
  createBoard();



  //create Characters
  //draw pacman onto the board
  let pacmanCurrentIndex = 490
  squares[pacmanCurrentIndex].push('pac-man')
  //get the coordinates of pacman on the grid with X and Y axis
  // function getCoordinates(index) {
  //   return [index % width, Math.floor(index / width)]
  // }

  // console.log(getCoordinates(pacmanCurrentIndex))

  function getClass(blockID) {
    if(sq[blockID].includes("ghost")) {
      return 0.75;
    }else if(sq[blockID].includes("wall")) {
      return 0.25;
    }else if(sq[blockID].includes("pac-dot")) {
      return 0.5;
    }else if(sq[blockID] == []) {
      return 0;
    }else if(sq[blockID].includes("power-pellet")) {
      return 1;
    }else{
      return 0;
    }
  }

  function getNearBlocks(squares) {
    up = getClass(pacmanCurrentIndex-28);
    down = getClass(pacmanCurrentIndex+28);
    left = getClass(pacmanCurrentIndex-1);
    right = getClass(pacmanCurrentIndex+1);
    blocks = [up,down,left,right];
    return blocks;
  }

  function getWholeScreen() {
    var screenArr = [];
    for(i = 0; i < squares.length; i++) {
      screenArr.push(getClass(i));
    }
    return screenArr;
  }
  gWS = getWholeScreen
  gNB = getNearBlocks;

  //move pacman
  function aiMove(dir) {
    d = new Date();
    oldPos = pacmanCurrentIndex;
    squares[pacmanCurrentIndex].splice(sq[pacmanCurrentIndex].indexOf('pac-man'),1)
    if(dir == 0) {
      if(!squares[pacmanCurrentIndex-1].includes('wall') && !squares[pacmanCurrentIndex -1].includes('ghost-lair')) {
        pacmanCurrentIndex -= 1
        if (squares[pacmanCurrentIndex -1] === squares[363]) {
          pacmanCurrentIndex = 391
        }
        score += 0.02;
      }else{
        //hitWall++;
        score -= 0.01;
      }
    }
    if(dir == 2) { //Up
      if(pacmanCurrentIndex - width >= 0 && !squares[pacmanCurrentIndex -width].includes('wall') && !squares[pacmanCurrentIndex -width].includes('ghost-lair')) {
        pacmanCurrentIndex -= width
        score += 0.02;
      }else{
        hitWall++;
        score -= 0.01;
      }
    }
    if(dir == 1) { //Right
      if(pacmanCurrentIndex % width < width - 1 && !squares[pacmanCurrentIndex +1].includes('wall') && !squares[pacmanCurrentIndex +1].includes('ghost-lair')) {
        pacmanCurrentIndex += 1
        if (squares[pacmanCurrentIndex +1] === squares[392]) {
          pacmanCurrentIndex = 364
        }
        score += 0.02;
      }else{
        hitWall++;
        score -= 0.01;
      }
    }
    if(dir == 3) { //Down
      if (!squares[pacmanCurrentIndex+width].includes('wall') && !squares[pacmanCurrentIndex+width].includes('ghost-lair')) {
        pacmanCurrentIndex += width
        score += 0.02;
      }else{
        hitWall++;
        score -= 0.01;
      }
    }
    squares[pacmanCurrentIndex].push('pac-man')
    if(oldPos != pacmanCurrentIndex) {
      oldPos = pacmanCurrentIndex;
      idleTime = d.getTime();
      hitWall = 0;
    }

    pacDotEaten(squares)
    powerPelletEaten(squares)
    checkForGameOver(squares)
    checkForWin(squares)
    return [score,hitWall]
  }

  aiM = aiMove;

  function movePacman(e,squares) {

    squares[pacmanCurrentIndex].classList.remove('pac-man')
    switch(e.keyCode) {
      case 37: //Left
        if(
          pacmanCurrentIndex % width !== 0 &&
          !squares[pacmanCurrentIndex -1].indexOf('wall') != -1&&
          !squares[pacmanCurrentIndex -1].indexOf('ghost-lair') != -1
          )
        pacmanCurrentIndex -= 1
        if (squares[pacmanCurrentIndex -1] === squares[363]) {
          pacmanCurrentIndex = 391
        }
        break
      case 38: //Up
        if(
          pacmanCurrentIndex - width >= 0 &&
          !squares[pacmanCurrentIndex -width].indexOf('wall') != -1 &&
          !squares[pacmanCurrentIndex -width].indexOf('ghost-lair') != -1
          )
        pacmanCurrentIndex -= width
        break
      case 39: //Right
        if(
          pacmanCurrentIndex % width < width - 1 &&
          !squares[pacmanCurrentIndex +1].indexOf('wall') != -1 &&
          !squares[pacmanCurrentIndex +1].indexOf('ghost-lair') != -1
        )
        pacmanCurrentIndex += 1
        if (squares[pacmanCurrentIndex +1] === squares[392]) {
          pacmanCurrentIndex = 364
        }
        break
      case 40: //Down
        if (
          pacmanCurrentIndex + width < width * width &&
          !squares[pacmanCurrentIndex +width].indexOf('wall') != -1 &&
          !squares[pacmanCurrentIndex +width].indexOf('ghost-lair') != -1
        )
        pacmanCurrentIndex += width
        break
    }
    squares[pacmanCurrentIndex].push('pac-man')
    pacDotEaten(squares)
    powerPelletEaten(squares)
    checkForGameOver(squares)
    checkForWin(squares)
  }
  ////document.addEventListener('keyup', movePacman)

  // what happens when you eat a pac-dot
  function pacDotEaten(squares) {
    if (squares[pacmanCurrentIndex].indexOf('pac-dot') != -1) {
      score++
      //scoreDisplay.innerHTML = score
      squares[pacmanCurrentIndex].splice(squares[pacmanCurrentIndex].indexOf('pac-dot'),1)
    }
  }

  //what happens when you eat a power-pellet
  function powerPelletEaten(squares) {
    if (squares[pacmanCurrentIndex].includes('power-pellet')) {
      score +=10
      ghosts.forEach(ghost => ghost.isScared = true)
      setTimeout(unScareGhosts, 10000*timeScale)
      squares[pacmanCurrentIndex].splice(squares[pacmanCurrentIndex].indexOf('power-pellet'),1)
    }
  }

  //make the ghosts stop flashing
  function unScareGhosts() {
    ghosts.forEach(ghost => ghost.isScared = false)
  }

  //create ghosts using Constructors
  class Ghost {
    constructor(className, startIndex, speed) {
      this.className = className
      this.startIndex = startIndex
      this.speed = speed
      this.currentIndex = startIndex
      this.isScared = false
      this.timerId = NaN
      this.movementQueue = [];
    }
  }

  //all my ghosts
  ghosts = [
    new Ghost('blinky', 348, 250),
    new Ghost('pinky', 376, 400),
    new Ghost('inky', 351, 300),
    new Ghost('clyde', 379, 500)
    ]

  //draw my ghosts onto the grid
  ghosts.forEach(ghost => {
    squares[ghost.currentIndex].push(ghost.className)
    squares[ghost.currentIndex].push('ghost')
    })

  //move the Ghosts randomly
  ghosts.forEach(ghost => moveGhost(ghost,squares))

  setInterval(function() {
    d = new Date();
    if((d.getTime()-idleTime)/1000 > 100) {
      idleTime = d.getTime();
      ghosts.forEach(ghost => clearInterval(ghost.timerId))
      //////document.removeEventListener('keyup', movePacman)
      resetBoard(squares);
      score = 0;
      //restart();
    }
  }, 500*timeScale);

  function moveGhost(ghost,squares) {

    const directions =  [-1, +1, width, -width]
    var aD = [];
    var available = 0;
    directions.forEach((d, i) => {
      if(!squares[ghost.currentIndex+d].indexOf("wall") != -1 && !squares[ghost.currentIndex+d].indexOf("ghost") != -1) {
        aD.push(d);
        available++;
      }
    });

    let direction = directions[Math.floor(Math.random() * directions.length)];
    distToPac = pacmanCurrentIndex-ghost.currentIndex;
    if(pacmanCurrentIndex < ghost.currentIndex) {
      distToPac = ghost.currentIndex-pacmanCurrentIndex;
    }

    newDistToPac = pacmanCurrentIndex-ghost.currentIndex+direction;
    if(pacmanCurrentIndex < ghost.currentIndex+direction) {
      distToPac = ghost.currentIndex+direction-pacmanCurrentIndex;
    }
    if(distToPac < newDistToPac) {
      if(Math.floor(Math.random()*3) == 0) {
        direction = aD[Math.floor(Math.random() * aD.length)]
      }
    }
  }



    /*ghost.timerId = setInterval(function() {
      find = 1;
      if(ghost.className != "") {
        if(pf.getIndexPoint(ghost.currentIndex)[1] > 10  && pf.getIndexPoint(ghost.currentIndex)[1] < 17) {
          if(pf.getIndexPoint(ghost.currentIndex)[0] > 10  && pf.getIndexPoint(ghost.currentIndex)[0] < 16) {
            find = 0;
          }
        }
        if(find == 1) {
          distToPac = pacmanCurrentIndex-ghost.currentIndex;
          if(distToPac < 0) {
            distToPac = distToPac*-1;
          }
          gpoint = ghost.currentIndex;
          ppoint = pacmanCurrentIndex;
          l = pf.getIndexPoint(gpoint)[0]-pf.getIndexPoint(ppoint)[0];
          if(l<0) {
            l = l*-1;
          }
          if(l < 5) {
            r = pf.getIndexPoint(gpoint)[1]-pf.getIndexPoint(ppoint)[1];
            if(r<0) {
              r=r*-1;
            }
            if(r < 10) {
              if(ghost.movementQueue.length == 0) {
                ret = pf.fp(pf.getIndexPoint(ghost.currentIndex),pf.getIndexPoint(pacmanCurrentIndex),sq);
                if(ret != 0) {
                  ret.forEach((r, i) => {
                    ghost.movementQueue.push(r);
                  });
                }
              }
            }
          }
        }
      }
      if(ghost.movementQueue.length != 0) {
        direction = ghost.movementQueue[0];
        ghost.movementQueue.shift();
      }
      //if the next squre your ghost is going to go to does not have a ghost and does not have a wall
      if(!squares[(ghost.currentIndex + direction)].includes('ghost') &&
        !squares[ghost.currentIndex + direction].indexOf('wall') != -1) {
          //remove the ghosts classes
          squares[ghost.currentIndex].splice(sq[ghost.currentIndex].indexOf(ghost.className),1)
          squares[ghost.currentIndex].splice(sq[ghost.currentIndex].indexOf('ghost'),1)
          squares[ghost.currentIndex].splice(sq[ghost.currentIndex].indexOf('scared-ghost'),1)
          //move into that space
          ghost.currentIndex += direction
          squares[ghost.currentIndex].push(ghost.className, 'ghost')
      //else find a new random direction ot go in
      } else direction = directions[Math.floor(Math.random() * directions.length)]

      //if the ghost is currently scared
      if (ghost.isScared) {
        squares[ghost.currentIndex].push('scared-ghost')
      }

      //if the ghost is currently scared and pacman is on it
      if(ghost.isScared && squares[ghost.currentIndex].indexOf('pac-man')) {
        squares[ghost.currentIndex].splice(sq[ghost.currentIndex].indexOf(ghost.className),1)
        squares[ghost.currentIndex].splice(sq[ghost.currentIndex].indexOf('ghost'),1)
        squares[ghost.currentIndex].splice(sq[ghost.currentIndex].indexOf('scared-ghost'),1)
        ghost.currentIndex = ghost.startIndex
        score +=100
        squares[ghost.currentIndex].push(ghost.className, 'ghost')
      }
    checkForGameOver(squares)
  }, ghost.speed*timeScale)*/

  function resetBoard(squares) {
    score = 0;
    idleTime = d.getTime();
    ghosts.forEach(ghost => clearInterval(ghost.timerId))
    //document.removeEventListener('keyup', movePacman)

    squares.forEach((square, i) => {
      square.classList = "";
    });
    ghosts.forEach((ghost, i) => {
      ghost.currentIndex = ghost.startIndex;
    });


    createBoard()
    squares[pacmanCurrentIndex].splice(sq[pacmanCurrentIndex].indexOf('pac-man'),1)
    pacmanCurrentIndex = 490
    squares[pacmanCurrentIndex].push('pac-man')
    //document.addEventListener('keyup', movePacman)
    ghosts.forEach(ghost => {
      squares[ghost.currentIndex].push(ghost.className)
      squares[ghost.currentIndex].push('ghost')
      })
    ghosts.forEach(ghost => moveGhost(ghost,squares))
  }

  //check for a game over
  function checkForGameOver(squares) {
    if (squares[pacmanCurrentIndex].indexOf('ghost') != -1&&
      !squares[pacmanCurrentIndex].indexOf('scared-ghost') != -1) {
      ghosts.forEach(ghost => clearInterval(ghost.timerId))
      //document.removeEventListener('keyup', movePacman)
      resetBoard(squares);
      score = 0;
      //restart();
    }
  }

  //check for a win - more is when this score is reached
  function checkForWin() {
    if (score === 274) {
      ghosts.forEach(ghost => clearInterval(ghost.timerId))
      //document.removeEventListener('keyup', movePacman)
      setTimeout(function(){ alert("You have WON!"); }, 500)
    }
  }
//})

brain.createBrain()
brain.playGame(gWS,aiM)
