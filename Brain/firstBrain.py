import time
import random
from pprint import pprint
import pdb


eul = 2.7182818

def sigmoid(x):
    return 1/(1+pow(eul,-x))
weights = [0.15,0.25,0.2,0.3,0.4,0.5,0.45,0.55]
biases = [0.35,0.6]
w = 0
b = 0
def createLayer(length,nextLen,activationFunction,derivative):
    global w
    global b
    nodeLayer = []
    weightLayer = []
    bias = 0
    if(nextLen != -1):
        bias = biases[b]
        b+=1
    for i in range(length):
        nodeLayer.append(0)
        if(nextLen != -1):
            for j in range(nextLen):
                #weight = random.random()*2-1
                weight = weights[w]
                w+=1
                weightLayer.append([i,j,weight])
    return [nodeLayer,weightLayer,bias,activationFunction,derivative] #Structure is [Node layer, Weight layer, Bias, Activation function, Activation function derivative]

class Brain():
    def __init__(self, inputNodes, hiddenLayers, hiddenNodes, outputNodes,activationFunctions):
        self.neuralNet = []
        self.neuralNet.append(createLayer(inputNodes,hiddenNodes[0],activationFunctions[0],0))
        for i in range(hiddenLayers):
            if(i == hiddenLayers-1):
                nextLayer = outputNodes
            else:
                nextLayer = hiddenNodes[i+1]
            self.neuralNet.append(createLayer(hiddenNodes[i],nextLayer,activationFunctions[i+1],0))
        self.neuralNet.append(createLayer(outputNodes,-1,activationFunctions[hiddenLayers+1],0))


    def setNode(self,layer,node,value):
        self.neuralNet[layer][0][node] = value


    def think(self):
        for i in range(len(self.neuralNet)-1):
            newLayer = []
            debugLayer = []
            nodeLayer = self.neuralNet[i][0]
            weightLayer = self.neuralNet[i][1]
            bias = self.neuralNet[i][2]
            for n in nodeLayer:
                newLayer.append(0)
                debugLayer.append([])
            for j in weightLayer:
                weight = j
                newLayer[weight[1]] += nodeLayer[weight[0]]*weight[2]
                debugLayer[weight[1]].append([nodeLayer[weight[0]],"*",weight[2]])
            for n in range(len(newLayer)):
                newLayer[n]+=bias
                debugLayer[n].append([bias])
            for n in range(len(newLayer)):
                node = newLayer[n]
                self.neuralNet[i+1][0][n] = sigmoid(node)



brain = Brain(2,1,[2],2,[sigmoid,sigmoid,sigmoid,sigmoid])
brain.setNode(0,0,0.05)
brain.setNode(0,1,0.1)
brain.think()

#pdb.set_trace()
pprint(brain.neuralNet)

out_1 = brain.neuralNet[-1][0][0]
out_2 = brain.neuralNet[-1][0][1]
e_1 = (1/2)*pow(0.01-out_1,2)
e_2 = (1/2)*pow(0.99-out_2,2)
e_total = e_1+e_2
print(e_total)
