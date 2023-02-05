

function explore(loc) {
  let c = loc[0];
  let r = loc[1];
  let allNeighbors = [];

  if(r > 0) {
    if(newGrid[c][r-1] != "Wall") {
      allNeighbors.push([c,r-1]);
    }
  }
  if(r < 28) {
    if(newGrid[c][r+1] != "Wall") {
      allNeighbors.push([c,r+1]);
    }
  }
  if(c > 0) {
    if(newGrid[c-1][r] != "Wall") {
      allNeighbors.push([c-1,r]);
    }
  }
  if(c < 28) {
    if(newGrid[c+1][r] != "Wall") {
      allNeighbors.push([c+1,r]);
    }
  }
  return allNeighbors;
}

function getRow(id) {
  c = id
  r = 0;
  while((c-28) > 0) {
    c = c-28;
    r++;
  }

  return [c,r];

}


function fp(origin, end,sq) {
  getGrid(sq);

  done = 0;
  broken = 0;
  parents = [];
  paths = [origin];
  corPath = 0;
  visited = [];
  eMax = end[0]+5;
  eMin = end[0]-5
  idleTime = new Date().getTime();
  while(!done) {
    d = new Date();
    if((d.getTime()-idleTime)/1000 > 2) {
      idleTime = d.getTime();
      console.log("Breaking Loop");
      broken=1;
      done=1;
    }
//  for(i = 0; i < 7; i++) {

    p = paths[0]
    if(visited.find(v => v == p) == undefined) {
      nB = explore(p);
      nB.forEach((b, c) => {
        //if(b[0] > eMin && b[0] < eMax) {
          parents.push([b,p]);
          paths.push(b);
          if(b[0] == end[0] && b[1] == end[1]) {
            done=1;
          }
        //}
      });
      visited.push(p);
    }
    paths.shift();
  }

  if(broken == 0) {
    done = 0;
    pToFind = end;
    skip = 0;
    steps = []
    while(!done) {
      steps.push(pToFind);
      if(pToFind[0] == origin[0] && pToFind[1] == origin[1]) {
        done = 1;
      }
      pFound = parents.find(p => p[0][0] == pToFind[0] && p[0][1] == pToFind[1]);
      if(pFound == undefined) {
        skip = 1;
        break;
      }
      pToFind = pFound[1];
    }
    if(skip == 0) {
      steps.reverse();

      mA = []

      steps.forEach((step, i) => {
        prevStep = steps[i-1]
        if(i != 0) {
          if((step[0]-prevStep[0]) == 1) {
            mA.push(+28);
          }else if((step[0]-prevStep[0]) == -1) {
            mA.push(-28);
          }else if((step[1]-prevStep[1]) == 1) {
            mA.push(+1);
          }else if((step[1]-prevStep[1]) == -1) {
            mA.push(-1);
          }
        }
      });
      return mA;
    }else{
      return 0;
    }
  }else{
    return 0;
  }

}

function getIndexPoint(p) {
  point = p;
  r = 0;
  c = 0;
  while(point > 28) {
    r++;
    point-=28;
  }
  c = point;
  return [r,c];
}


function getGrid(squaregrid) {
  val0 = 0;
  ghostPoints = [];
  endPoint = [];
  for(i = 0; i < squaregrid.Length; i++) {
    pos = getRow(i);
    if(squaregrid[i].classList == "wall" || squaregrid[i].classList == "ghost-lair"){
      newGrid[pos[1]][pos[0]] = "Wall";
    }else{
      newGrid[pos[1]][pos[0]] = "Walkable";
    }

    if(squaregrid[i].classList == "pac-man") {
      endPoint = [pos[1],pos[0]];
    }else if(squaregrid[i].classList.contains("ghost")) {
      ghostPoints.push([pos[1],pos[0]]);
    }
    if(pos[0] == 28 && newGrid[pos[1]].length > 0) {
      newGrid.push([]);
    }
  }
}

newGrid = [[]];
/*function checkArea(sq) {
  val0 = 0;
  squaregrid = sq;
  ghostPoints = [];
  endPoint = [];
  for(i = 0; i < squaregrid.length; i++) {
    pos = getRow(i);
    console.log(pos[1])
    if(squaregrid[i].classList == "wall"){
      newGrid[pos[1]][pos[0]] = "Wall";
    }else{
      newGrid[pos[1]][pos[0]] = "Walkable";
    }

    if(squaregrid[i].classList == "pac-man") {
      endPoint = [pos[1],pos[0]];
    }else if(squaregrid[i].classList.contains("ghost")) {
      ghostPoints.push([pos[1],pos[0]]);
    }
    if(pos[0] == 28 && newGrid[pos[1]].length > 0) {
      newGrid.push([]);
    }
  }

  explore([0,0]);

  console.log(newGrid);

  clusters = 0;
  queue = [[0,0]];
  point = [];
  currentPoint = 0;
  for(i = 0; i < queue.length; i++) {
    point = queue[i];
    if(newGrid[point[0]][point[1]] == "Empty" || newGrid[point[0]][point[1]] == "TARGET") {
      if(point[1] < 9) {
        if(newGrid[point[0]][point[1]+1] == "Empty" || newGrid[point[0]][point[1]] == "TARGET") {
          if(queue.find(p => p[0]==point[0]&&p[1]==point[1]+1) == undefined) {
            queue.push([point[0],point[1]+1]);
          }
        }
      }
      if(point[1] > 0) {
        if(newGrid[point[0]][point[1]-1] == "Empty" || newGrid[point[0]][point[1]] == "TARGET") {
          if(queue.find(p => p[0]==point[0]&&p[1]==point[1]-1) == undefined) {
            queue.push([point[0],point[1]-1]);
          }
        }
      }
      if(point[0] > 0) {
        if(newGrid[point[0]-1][point[1]] == "Empty" || newGrid[point[0]][point[1]] == "TARGET") {
          if(queue.find(p => p[0]==point[0]-1&&p[1]==point[1]) == undefined) {
            queue.push([point[0]-1,point[1]]);
          }
        }
      }
      if(point[0] < 20) {
        if(newGrid[point[0]+1][point[1]] == "Empty" || newGrid[point[0]][point[1]] == "TARGET") {
          if(queue.find(p => p[0]==point[0]+1&&p[1]==point[1]) == undefined) {
            queue.push([point[0]+1,point[1]]);
          }
        }
      }

    }
  }


  ghostPoints.forEach((ghost, gh) => {
    col = ghost[0];
    row = ghost[1];
    currentPoss = [];
    possiblePaths = [];
    newGrid.forEach((g, i) => {
      g.forEach((gr, j) => {
        if(i => col) {
          if(queue.find(p => p[0] == i && p[1] == j) == undefined) {
            possiblePaths[gh].push(currentPoss);
          }else{
            currentPoss.push(

            )
          }


        }



      });
    });
  });


  newGrid.forEach((g, i) => {
    g.forEach((gr, j) => {
      if(gr == "Empty") {
        if(queue.find(p => p[0] == i && p[1] == j) == undefined) {
          clusters++;
        }
      }
    });
  });
  penalty = 0;
  newClusters = clusters-oldClusters;
  for(i = 0; i < newClusters; i++) {
    penalty += 0.05;
  }
  oldClusters = clusters;
  if(penalty > 0.0) {
    score -= penalty;
  }
}*/

function fg() {
  p = findPath([17,14],[17,17]);
  printPath(p);
}

module.exports = {
  fp,
  getIndexPoint
}
