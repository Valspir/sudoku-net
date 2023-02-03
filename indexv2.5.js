
const { exec } = require("child_process");
const fs = require("fs")
reMulti = 0.3//parseFloat(document.getElementById('reMulti').value)
punMulti = 0.1//parseFloat(document.getElementById('punMulti').value)
mutProb = 2//parseInt(document.getElementById('mutProb').value)
popSize = 750//parseInt(document.getElementById('popSize').value)
hidLayers = 2//parseInt(document.getElementById('hidLayers').value)
hidLayerNodes = 50//parseInt(document.getElementById('hidLayerNodes').value)
learn_rate = 0.3//parseFloat(document.getElementById('learn_rate').value)
grid = []
playableGrid = []

function restart() {
  /*document.getElementById('generation').innerText = '0';
  document.getElementById('highestScore').innerText = '0';
  document.getElementById('currentScore').innerText = '0';
  document.getElementById('avgScore').innerText = '0';
  document.getElementById('curRow').innerText = '0';
  document.getElementById('curCol').innerText = '0';*/
  createBrain();
  useBrains();
}

function createArray() {
    grid = []
    playableGrid = []
    for(i = 0; i < 9; i++) {
        grid.push([])
        playableGrid.push([])
        for(j = 0; j < 9; j++) {
            grid[i].push(0)
        }
    }

}

function getRow(grid,row) {
    return grid[row];
}

function getColumn(grid,column) {
    col = []
    grid.forEach((rows, i) => {
        col.push(rows[column])
    })
    return col
}

function getSquare(grid,row,column) {
    square = []
    if(row < 3) {
        if(column < 3) {
            for(i = 0; i < 3; i++) {
                for(j = 0; j < 3; j++) {
                    square.push(grid[i][j])
                }
            }
        }else if(column < 6) {
            for(i = 0; i < 3; i++) {
                for(j = 3; j < 6; j++) {
                    square.push(grid[i][j])
                }
            }
        }else if(column < 9) {
            for(i = 0; i < 3; i++) {
                for(j = 6; j < 9; j++) {
                    square.push(grid[i][j])
                }
            }
        }
    }else if(row < 6) {
        if(column < 3) {
            for(i = 3; i < 6; i++) {
                for(j = 0; j < 3; j++) {
                    square.push(grid[i][j])
                }
            }
        }else if(column < 6) {
            for(i = 3; i < 6; i++) {
                for(j = 3; j < 6; j++) {
                    square.push(grid[i][j])
                }
            }
        }else if(column < 9) {
            for(i = 3; i < 6; i++) {
                for(j = 6; j < 9; j++) {
                    square.push(grid[i][j])
                }
            }
        }
    }else if(row < 9) {
        if(column < 3) {
            for(i = 6; i < 9; i++) {
                for(j = 0; j < 3; j++) {
                    square.push(grid[i][j])
                }
            }
        }else if(column < 6) {
            for(i = 6; i < 9; i++) {
                for(j = 3; j < 6; j++) {
                    square.push(grid[i][j])
                }
            }
        }else if(column < 9) {
            for(i = 6; i < 9; i++) {
                for(j = 6; j < 9; j++) {
                    square.push(grid[i][j])
                }
            }
        }
    }
    return square
}

/*function //drawGrid(g=grid) {
    document.getElementById("container").innerHTML = ""
    board = document.createElement("div")
    board.setAttribute("id","board")
    document.getElementById("container").appendChild(board)
    for(i = 0; i < 9; i++) {
        sq = document.createElement("div");
        sq.setAttribute("class","square")
        document.getElementById("container").appendChild(sq)
    }
    g.forEach((row) => {
        row.forEach((tile) => {
            div = document.createElement("div")
            div.setAttribute("class", "tile")
            val = document.createElement("span")

            val.textContent = tile
            val.setAttribute("class", "cellValue")
            div.appendChild(val)
            board.appendChild(div)
        })
    })

}*/

function checkGrid(g=grid) {
    inArr = 1
    g.forEach((currentRow) => {
        if(currentRow.includes(0)) {
            inArr = 0
        }
    })
    return inArr
}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
}

function fillGrid(row,column) {
    if(row == 8 && column == 9) {
        return true
    }

    if(column == 9) {
        row+=1
        column = 0
    }
    nA = [1,2,3,4,5,6,7,8,9]
    nA = shuffle(nA)

    if(grid[row][column] == 0) {
        nA.forEach((value) => {
            if(!getRow(grid,row).includes(value) && !getColumn(grid,column).includes(value) && !getSquare(grid,row,column).includes(value)) {
                grid[row][column] = value
                //drawGrid()
                if(fillGrid(row,column+1)) {
                    return true
                }
            }
        })
        //grid[row][column] = 0
    }else{
        if(fillGrid(row,column+1)) {
            return true
        }
    }
    return false
}.9

function createBoardConfig() {
    while(!checkGrid()) {
        //console.log("Creating Board")
        createArray()
        fillGrid(0,0)
    }
    populateGrid()
    //drawGrid(playableGrid)
}

blankCount = 0
function populateGrid() {
    grid.forEach((row, r) => {
        row.forEach((tile, c) => {
            addTile = Math.floor(Math.random()*20);
            if(addTile < 15) {
                playableGrid[r].push(tile)
            }else{
                blankCount++
                playableGrid[r].push(0)
            }
        })
    })
}

function setTile(r,c,val) {
    playableGrid[r][c] = val
    if(grid[r][c] != val) {
        //console.log(false)
    }else{
        //console.log(true)
    }
    //drawGrid(playableGrid)
}


createArray()
populateGrid()
createBoardConfig()

const delay = (delayInms) => {
  return new Promise(resolve => setTimeout(resolve, delayInms));
}

//Machine Learning Code:

eul = 2.7182818

function pow(val,pow) {
    return Math.pow(val,pow)
}

function softmax(inputs) {

    vals = []
    sum = 0
    for(i = 0; i < inputs.length; i++) {
      sum+=Math.pow(eul,inputs[i])
    }
    for(i = 0; i < inputs.length; i++) {
      vals.push(Math.pow(eul,inputs[i])/sum)
    }
    return vals
}

function tanh(x) {
    return (pow(eul,x)-pow(eul,-x))/(pow(eul,x)+pow(eul,-x))
}

function sigmoid(val) {
    return 1/(1+Math.pow(eul,val))
}

function outputFunction(val) {
    return Math.round(relu(tanh(val)*9))
}


function relu(val) {
    if(val > 0) {
        return val
    }else{
        return 0
    }
}

function binStep(val) {

}

/*function showBrain(brain) {
  document.getElementById("svgCanvas").innerHTML = ""
  nodeCoords = []
  nodeArray = brain.nodes
  weightArray = brain.weights
    posX = 50
    for(nL = 0; nL < nodeArray.length; nL++) {
        posY = 50
        nodeCoords.push([])
        for(n = 0; n < nodeArray[nL].length; n++) {
            nodeCoords[nL].push([posX,posY])
            node = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
            node.setAttributeNS(null,"cx",posX)
            node.setAttributeNS(null,"cy",posY)
            node.setAttributeNS(null,"r","2.5")
            node.setAttributeNS(null,"fill","black")
            node.setAttributeNS(null,"stroke","black")
            document.getElementById("svgCanvas").appendChild(node)
            posY+=20
        }
        posX+=100
    }

    for(wL = 0; wL < weightArray.length; wL++) {

        for(w = 0; w < weightArray[wL].length; w++) {
            weight = weightArray[wL][w]
            startNode = nodeCoords[weight[0]][weight[1]]
            endNode = nodeCoords[weight[0]+1][weight[2]]
            if(endNode != undefined) {
                line = document.createElementNS("http://www.w3.org/2000/svg","line")
                line.setAttriimport {exec} from "child_process";buteNS(null,"x1",startNode[0])
                line.setAttributeNS(null,"y1",startNode[1])
                line.setAttributeNS(null,"x2",endNode[0])
                line.setAttributeNS(null,"y2",endNode[1])
                if(weight[3] < 0) {
                    line.setAttributeNS(null,"style","stroke:rgb(255,0,0);stroke-width:2")
                }else{
                    line.setAttributeNS(null,"style","stroke:rgb(0,255,0);stroke-width:2")
                }
                document.getElementById("svgCanvas").appendChild(line)
            }
        }
    }
  }
*/
class Brain {
    constructor(nodes, weights) {
        this.nodes = nodes;
        this.weights = weights;
        this.rating = 0;
        this.moves = [];
    }
    async think() {
        var start = Date.now();
        for(var wl = 0; wl < this.weights.length; wl++) {
            var weightLayer = this.weights[wl]
            for(var w = 0; w < weightLayer.length; w++) {
                var weight = weightLayer[w]
                //console.log(weight)
                if(isNaN(this.nodes[weight[0]+1][weight[2]])) {
                  /*console.log(weight[0])
                  console.log(this.nodes[weight[0]][weight[1]])
                  console.log(weight[3])
                  console.log(this.nodes[weight[0]][weight[1]]*weight[3])
                  console.log(this.nodes[weight[0]+1])
                  debugger*/
                  this.nodes[weight[0]+1][weight[2]] = 0
                }else{
                  this.nodes[weight[0]+1][weight[2]] += this.nodes[weight[0]][weight[1]]*weight[3]
                }


            }
        }
        for(var i = 0; i < this.nodes.length; i++) {
            var nodeLayers = this.nodes[i]
            if(i != 0) {
                for(var n = 0; n < nodeLayers.length; n++) {
                    var node = nodeLayers[n]
                    if(i != this.nodes.length-1) {
                      if(isNaN(this.nodes[i][n]) || isNaN(sigmoid(node))) {
                        console.log("-----")
                        console.log(i)
                        console.log(this.nodes[i])
                        console.log(sigmoid(node))
                        debugger
                      }
                        this.nodes[i][n] = sigmoid(node)
                    }
                }
            }
        }
        var sum = 0
        for(var p = 0; p < this.nodes[this.nodes.length-1].length; p++) {
          if(isNaN(this.nodes[this.nodes.length-1][p])) {
            console.log(this.nodes[2])
            console.log(this.nodes[this.nodes.length-1])
            console.log(this.weights[2])
            debugger
          }
          sum+=Math.pow(eul,this.nodes[this.nodes.length-1][p])
        }
        for(var p = 0; p < this.nodes[this.nodes.length-1].length; p++) {
          this.nodes[this.nodes.length-1][p] = Math.pow(eul,this.nodes[this.nodes.length-1][p])/sum
        }
        sum = 0
        for(var p = 0; p < this.nodes[this.nodes.length-1].length; p++) {
          sum+=Math.pow(eul,this.nodes[this.nodes.length-1][p])
        }
        for(var p = 0; p < this.nodes[this.nodes.length-1].length; p++) {
          this.nodes[this.nodes.length-1][p] = Math.pow(eul,this.nodes[this.nodes.length-1][p])/sum
        }
        //var newNodes = softmax(this.nodes[this.nodes.length-1])
        //Object.assign(this.nodes[this.nodes.length-1],newNodes)
        var end = Date.now();
    }
    setInput(n,val) {
        this.nodes[0][n] = val
    }
    updateRating(rating) {
        this.rating = ratingdrawGrid
    }
}

brainArray = []
weightCount=0
function createBrain(inputs=81, hiddenLayers=hidLayers, hiddenCount=hidLayerNodes, outputs=10, outputFunctions={softmax,softmax,softmax}) {
    inputNodes = []
    hiddenNodes = []
    outputNodes = []
    weights = []
    for(i = 0; i < inputs; i++) {
        inputNodes.push(0)
    }
    for(i = 0; i < hiddenLayers; i++) {
        hiddenNodes.push([])
        for(j = 0; j < hiddenCount; j++) {
            hiddenNodes[i].push(0)
        }
    }
    for(i = 0; i < outputs; i++) {
        outputNodes.push(0)
    }

    nodes = [inputNodes]
    for(hN = 0; hN < hiddenNodes.length; hN++) {
      nodes.push(hiddenNodes[hN])
    }
    nodes.push(outputNodes)

    for(nL = 0; nL < nodes.length-1; nL++) {
      weights.push([])

      for(node = 0; node < nodes[nL].length; node++) {
        for(node2 = 0; node2 < nodes[nL+1].length; node2++) {
            weightCount++
            weights[nL].push([nL,node,node2,(Math.random()*2-1)*0.1])
        }
      }
    }/*
    weights.push([])
    for(hidden1 = 0; hidden1 < hiddenCount; hidden1++) {
        for(hidden2 = 0; hidden2 < hiddenCount; hidden2++) {
            weightCount++
            weights[1].push([1,hidden1,hidden2,(Math.random()*2-1)*0.1])
        }
    }
    weights.push([])
    for(hidden = 0; hidden < hiddenCount; hidden++) {
        for(output = 0; output < outputs; output++) {
            weightCount++
            weights[2].push([2,hidden,output,(Math.random()*2-1)*0.1])
        }
    }*/


    brain = new Brain(nodes,weights)
    for(i = 0; i < popSize; i++) {
      brainArray.push(brain)
    }
}

function mutateBrain(brain) {
    newWeights = []
    brain.weights.forEach((weightLayer,i) => {
        newWeights.push([])
        chooseLayer = Math.floor(Math.random()*2);
        if(chooseLayer < brain.nodes.length-1) {
            weightLayer.forEach((weights) => {
              changeWeight = Math.floor(Math.random()*10);
              if(changeWeight < mutProb) {
                newWeight = (weights[3] + ((Math.random()*2)-1)*learn_rate)
                if(!(newWeight > 1) && !newWeight < -1) {
                  newWeights[i].push([weights[0],weights[1],weights[2],newWeight])

                }else{
                  newWeight = (weights[3] - ((Math.random()*2)-1)*learn_rate)
                  if(!(newWeight < -1) && !(newWeight > 1)) {
                    newWeights[i].push([weights[0],weights[1],weights[2],newWeight])
                  }else{
                      newWeights[i].push([weights[0],weights[1],weights[2],weights[3]])
                    }
                }
              }else{
                newWeights[i].push([weights[0],weights[1],weights[2],weights[3]])
              }
              currentWeight = newWeights[i][newWeights[i].length-1]
              if(currentWeight[3] < -1 || currentWeight[3] > 1) {
                console.log(currentWeight)
                debugger
              }
            })
        }else{
          weightLayer.forEach((weights) => {
            newWeights[i].push([weights[0],weights[1],weights[2],weights[3]])
          })
        }
    })

    let newBrain = new Brain(brain.nodes, newWeights)
    delete brain
    brainArray.push(newBrain)
}

function mergeBrains(brain1,brain2) {
  nodes = brain1['nodes']
  weights = []
  for(p = 0; p < brain1['weights'].length; p++) {
    weights.push([])
    for(q = 0; q < brain1['weights'][p].length; q++) {
      brainSelect = Math.round(Math.random())
      if(brainSelect) {
        weights[p].push(brain1['weights'][p][q])
      }else{
        weights[p].push(brain2['weights'][p][q])
      }
    }
  }
  delete brain1
  delete brain2
  let newBrain = new Brain(nodes,weights)
  delete nodes
  delete weights
  mutateBrain(newBrain)
}


scoreSum = 0
scoreCount = 0
goat = 0
highestScore = -1
boardsCleared = 0
async function useBrains() {
    generation = 0
    while(true) {
      if(!(brainArray.length > popSize*2)) {
        r=0
        c=0
        curBoardPos = 0
        createArray()
        populateGrid()
        createBoardConfig()
        while(!checkGrid(playableGrid)) {
            let ratings = []
            for(sB = 0; sB < brainArray.length; sB++) {
                //document.getElementById("brainID").innerText = sB
                selectedbrain=brainArray[sB]
                if(selectedbrain != 0) {
                  correct = 1
                  skips = 2
                  var brainRating = 10
                  boardsSkipped = 0
                  while(correct) {
                    if(brainRating > 0){
                      if(brainRating > 10000 && brainRating < 10010) {
                        fs.writeFileSync("training_complete.brn",JSON.stringify(selectedbrain))
                      }
                      await delay(0);
                      if(r == 9) {
                        c+=1
                        r = 0
                      }
                      if(c == 9) {
                        r = 0
                        c = 0
                        curBoardPos = 0
                        if(checkGrid(playableGrid)) {
                          boardsCleared+=1
                          brainRating+=5
                        }else{
                          boardsSkipped+=1
                          brainRating-=2
                          if(boardsSkipped > 5) {
                            correct = 0
                            break
                          }
                        }
                      }
                      //document.getElementById("curRow").innerText = r;
                      //document.getElementById("curCol").innerText = c;
                      currentInput = 0
                      for(h = 0; h < playableGrid.length; h++) {
                        for(v = 0; v < playableGrid[h].length; v++) {
                          if(grid[r][c] != grid[h][v]) { //Fix, what happens when grid[r][c] == 0
                            selectedbrain.setInput(currentInput,(1/9)*playableGrid[h][v])
                            currentInput+=1
                          }else{
                            selectedbrain.setInput(currentInput,-1)
                            currentInput+=1
                          }
                        }
                      }
                      selectedbrain.think()
                      high = 0
                      highestNode = 0
                      secondHighest = 0
                      for(cn = 0; cn < selectedbrain.nodes[selectedbrain.nodes.length-1].length; cn++) {
                        if(selectedbrain.nodes[selectedbrain.nodes.length-1][cn] > high) {
                          high = selectedbrain.nodes[selectedbrain.nodes.length-1][cn]
                          secondHighest = highestNode
                          highestNode = cn
                        }
                      }
                      if(highestNode != 9 || (selectedbrain.moves[selectedbrain.moves.length-1] == "S" && selectedbrain.moves[selectedbrain.moves.length-2] == "S")) {
                        chosenNode = 0
                        if(highestNode == 9) {
                          chosenNode = secondHighest
                        }else{
                          chosenNode = highestNode+1
                        }
                        selectedbrain.moves.push([chosenNode,grid[r][c],r,c])
                        if(grid[r][c] == chosenNode) {
                            setTile(r,c,chosenNode)
                            correct = 1
                            brainRating+=1
                            r+=1
                            curBoardPos++
                            /*if(curBoardPos > 0 && curBoardPos < 81) {
                              document.getElementById("board").childNodes[curBoardPos-1].style.backgroundColor = 'white'
                            }
                            if(curBoardPos < 81) {
                              document.getElementById("board").childNodes[curBoardPos].style.backgroundColor = 'yellow'
                            }*/
                        }else{
                            rating = grid[r][c] - chosenNode
                            if(rating < 0) {
                                rating=rating*-1
                            }
                            brainRating-=(rating*punMulti)
                            correct = 0
                        }
                      }else{
                        skips-=1
                        correct = 1
                        r+=1
                        selectedbrain.moves.push("S")
                        brainRating-=1*punMulti
                        curBoardPos++
                        /*if(curBoardPos > 0 && curBoardPos < 81) {
                          document.getElementById("board").childNodes[curBoardPos-1].style.backgroundColor = 'white'
                        }
                        if(curBoardPos < 81) {
                          document.getElementById("board").childNodes[curBoardPos].style.backgroundColor = 'yellow'
                        }*/
                        if(brainRating < 7) {
                          correct = 0
                        }
                      }
                      //delete r
                      //delete c
                      /*if(brainRating > 10) {
                          console.log("Brain in generation: " + generation + " at rating: " + brainRating)
                      }*/
                      //document.getElementById("currentScore").innerText = brainRating
                  }
                  console.clear()
                  process.stdout.write("Score: " + Math.round(brainRating*10)/10 + "\nBrain #: " + sB + "\nGeneration: " + generation + "\nHighest Score: " + Math.round(highestScore*10)/10 + "\nAvg Score: " + Math.round((scoreSum/scoreCount)*10)/10 + "\nBoards Cleared: " + boardsCleared)
                  //document.getElementById("currentScore").innerText = brainRating;
                  ratings.push([selectedbrain,brainRating])
                }
              }
            }
            //console.log(ratings)
            generation++
            best = -1
            brainArray = []
            bestBrain = 0
            for(i = 0; i < ratings.length; i++) {
                if(ratings[i][1] > best) {
                    scoreSum+=ratings[i][1]
                    scoreCount+=1
                    best = ratings[i][1]
                    bestBrain = ratings[i][0]
                    if(best > highestScore) {
                        highestScore = best
                        goat = bestBrain
                        //document.getElementById("highestScore").innerText = best;
                    }
                }
            }
            var sortedArray = ratings.sort((a,b) => b[1] - a[1])
            if(sortedArray.length != 1) {
              for(i = 0; i < (popSize/2)-1; i++) {
                mergeBrains(sortedArray[0][0],sortedArray[i][0])
              }
              for(i = 0; i < (popSize/2)-1; i++) {
                mergeBrains(sortedArray[0][0],sortedArray[1][0])
              }
              for(i = 0; i < 2; i++) {
                mergeBrains(goat,sortedArray[0][0])
              }
            }else{
              for(i = 0; i < popSize; i++) {
                  mutateBrain(bestBrain)
              }
            }

            if(generation%1 == 0) {
                //console.log("Generation: " + generation + " Rating: " + best + " Highest: " + highestScore)
            }
            //document.getElementById("generation").innerText = generation;
            //document.getElementById("avgScore").innerText = Math.round((scoreSum/scoreCount)*1000)/1000;

            //scoreSum = 0
            //scoreCount = 0
            delete ratings
          }
      }else{
        //console.log(brainArray.length)
      }
    }

}

function fakeAI() {
  createArray()
  populateGrid()
  createBoardConfig()
  r = 0
  c = 0
  correctCount = 0
  iter = 0
  while(!checkGrid(playableGrid)) {
    r+=1
    if(r == 9) {
      r = 0
      c+=1
    }
    if(c == 9) {
      console.log("Round ", iter, ", ", correctCount, " Correct")
      if(iter == 1000) {
        break
      }
      iter++
      correctCount = 0
      r = 0
      c = 0
    }

    solutions = [1,2,3,4,5,6,7,8,9]

    //console.log(row)
    for(i = 0; i < row.length; i++) {
      if(solutions.indexOf(row[i]) != -1) {
        solutions.splice(solutions.indexOf(row[i]),1)
      }
    }
    for(i = 0; i < square.length; i++) {
      if(solutions.indexOf(square[i]) != -1) {
        solutions.splice(solutions.indexOf(square[i]),1)
      }
    }
    for(i = 0; i < column.length; i++) {
      if(solutions.indexOf(column[i]) != -1) {
        solutions.splice(solutions.indexOf(column[i]),1)
      }
    }
    if(solutions.length == 1) {
      correctCount++
      setTile(r,c,solutions[0])
    }
    //console.log(solutions)
    //break

  }
}

function evaluateBrain(r,c,selectedbrain) {
    row = getRow(playableGrid,r)
    column = getColumn(playableGrid,c)
    square = getSquare(playableGrid,r,c)
    currentInput = 0
    row.forEach((i) => {
        selectedbrain.setInput(currentInput, i);
        currentInput++
    })
    column.forEach((i) => {
        selectedbrain.setInput(currentInput, i);
        currentInput++
    })
    square.forEach((i) => {
        selectedbrain.setInput(currentInput, i);
        currentInput++
    })
    selectedbrain.think()
    rating = grid[r][c] - selectedbrain.nodes[3][0]
    if(rating < 0) {
        rating=rating*-1
    }
    if(rating == 0) {
        setTile(r,c,selectedbrain.nodes[3][0])
    }
    selectedbrain.updateRating(rating)
    return [grid[r][c], selectedbrain.nodes[3][0], rating]
}

function playGame(brain) {
    playableGrid.forEach((row,r) => {
        row.forEach((tile, t) => {
            evaluateBrain(r,t,brain)
        })
    })
}


restart()
//Create fitness algortith based on distance to correct score
