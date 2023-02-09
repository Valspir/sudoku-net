var scr = 0;
var oldScr = 0;

var oldBrains = [];
var oldScores = [];
var oldLT = [];

var bestScore = 0;
var bestBrain = {};
var timeSinceBest = 0
var generation = 0;
var oldClusters = 0;
var connected = [];

var scoreCount = 0;
var scoreSum = 0;
var localScore = 0;
var livingTick = 0;
const util = require('util')


eul = 2.7182818

function sigmoid(val) {
  return (1/(1+Math.pow(2.71828182846, -val)));
}

function tanh(x) {
    return (Math.pow(eul,x)-Math.pow(eul,-x))/(Math.pow(eul,x)+Math.pow(eul,-x))
}

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
            if(i != 0  && i != nodeLayers.length-1) {
                for(var n = 0; n < nodeLayers.length; n++) {
                    var node = nodeLayers[n]
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

popSize = 100
brainArray = []
function createBrain(inputs=121, hiddenStruct=[80,50,20], outputs=4) {
    inputNodes = []
    hiddenNodes = []
    outputNodes = []
    weights = []
    for(i = 0; i < inputs; i++) {
        inputNodes.push(0)
    }
    /*for(i = 0; i < hiddenLayers; i++) {
        hiddenNodes.push([])
        for(j = 0; j < hiddenCount; j++) {
            hiddenNodes[i].push(0)
        }
    }*/
    for(i = 0; i < hiddenStruct.length; i++) {
      cL = hiddenStruct[i]
      hiddenNodes.push([])
      for(j = 0; j < cL; j++) {
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
            weights[nL].push([nL,node,node2,(Math.random()*2-1)*0.1])
        }
      }
    }
    brain = new Brain(nodes,weights)
    for(i = 0; i < popSize; i++) {
      mutateBrain(brain)
    }
}

function getScreen() {


}


function mutateBrain(brain) {
    newWeights = []
    brain.weights.forEach((weightLayer,i) => {
        newWeights.push([])
        chooseLayer = Math.floor(Math.random()*2);
        if(chooseLayer < brain.nodes.length-1) {
            weightLayer.forEach((weights) => {
              changeWeight = Math.floor(Math.random()*10);
              if(changeWeight < 2) {
                newWeight = (weights[3] + ((Math.random()*2)-1)*0.3)
                if(!(newWeight > 1) && !newWeight < -1) {
                  newWeights[i].push([weights[0],weights[1],weights[2],newWeight])
                }else{
                  newWeight = (weights[3] - ((Math.random()*2)-1)*0.3)
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




//setInterval(playGame, 500*timeScale);

const delay = (delayInms) => {
  return new Promise(resolve => setTimeout(resolve, delayInms));
}



async function playGame(gWS,aiM) {
  generation = 0
  while(true) {
    ratings = []
    for(sB = 0; sB < brainArray.length; sB++) {
      brainRating = 0
      selectedbrain = brainArray[sB]
      endGame = 0
      while(brainRating >= 0 && endGame == 0) {
        await delay(0);
        ret = gWS();
        ret.forEach((r, i) => {
          selectedbrain["nodes"][0][i] = r;
        });
        selectedbrain.think()
        output = selectedbrain["nodes"][selectedbrain["nodes"].length-1]
        quarter = 0
        confidence = -1
        highestNode = -1
        for(j = 0; j < output.length; j++) {
          if(output[j] == 0.25) {
            quarter+=1
          }
          if(output[j] > confidence) {
            highestNode = j
            confidence = output[j]
          }
        }
        if(quarter == 4) {
          //brainRating-=1
        }
        if(isNaN(selectedbrain.nodes[selectedbrain.nodes.length-1][0])) {
          brainRating-=2
        }
        hitWall = 0
        //if(confidence > 0.49) {
          //console.log(highestNode+":"+confidence)
          //brainRating+=0.3
          ret = aiM(highestNode)
          score = ret[0]
          hitWall = ret[1]
          brainRating+=score
        //}else{
          //brainRating-=0.2
        //}
        if(hitWall > 0) {
          brainRating-=1
          endGame = 1
        }
      }
      selectedbrain.rating = brainRating
      ratings.push([selectedbrain,brainRating])
    }
    console.log(generation)
    brainArray = []
    var sortedArray = ratings.sort((a,b) => b[1] - a[1])
    if(sortedArray.length != 1) {
      console.log("Highest score at gen "+generation+": " + sortedArray[0][1])
      console.log(sortedArray[0][0]["nodes"][sortedArray[0][0]["nodes"].length-1])
      for(i = 0; i < (popSize/2); i++) {
        mergeBrains(sortedArray[0][0],sortedArray[i][0])
      }
      for(i = 0; i < (popSize/2); i++) {
        mergeBrains(sortedArray[0][0],sortedArray[1][0])
      }
      for(i = 0; i < 2; i++) {
        //mergeBrains(goat,sortedArray[0][0])
      }

    }else{
      for(i = 0; i < popSize; i++) {
          mutateBrain(sortedArray[0][0])
      }
    }
    generation++
  }
}


module.exports = {
  playGame,
  createBrain
}
