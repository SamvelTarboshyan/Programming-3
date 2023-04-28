var express = require('express');
var app = express();
var server = require('http').Server(app);

var io = require("socket.io")(server);
var fs = (require)("fs")

app.use(express.static("."));

app.get("/",function (req,res){
    res.redirect("index.html");
});

server.listen(3000,function(){
    console.log("server is run");
});


function matrixGenerator(matrixSize, grass,grassEater,predator,flower) {
    var matrix = []
    ////  matrix սարքելու հատված
    for (let i = 0; i < matrixSize; i++) {
            matrix.push([])
            for (let j = 0; j < matrixSize; j++) {
                    matrix[i].push(0)
            }
    }

    // 1 -եր այսինքն խոտեր քցելու հատված մատռիքսում
    for (let i = 0; i < grass; i++) {
            let x = Math.floor(Math.random() * matrixSize)
            let y = Math.floor(Math.random() * matrixSize)
            matrix[y][x] = 1
    }
     //GrassEater 2

     for (let i = 0; i < grassEater; i++) {
            let x = Math.floor(Math.random() * matrixSize)
            let y = Math.floor(Math.random() * matrixSize)
            matrix[y][x] = 2
    }
    //3 predator


    for (let i = 0; i < predator; i++) {
            let x = Math.floor(Math.random() * matrixSize)
            let y = Math.floor(Math.random() * matrixSize)
            matrix[y][x] = 3
    }

    //4 flower


    for (let i = 0; i < flower; i++) {
            let x = Math.floor(Math.random() * matrixSize)
            let y = Math.floor(Math.random() * matrixSize)
            matrix[y][x] = 4
    }


    

   
   
    return matrix
}

matrix = matrixGenerator(25, 17,7,4,6)
io.sockets.emit("send matrix",matrix)


grassArr = []
grassEaterArr = []
predatorArr = []
flowerArr = []

Grass = require("./grass")
GrassEater = require("./grassEater")
Predator = require("./predator")
Flower = require("./flower")


function createObject(){


for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
            if (matrix[y][x] == 1) {
                    let grass = new Grass(x, y)

                    grassArr.push(grass)


            } else if(matrix[y][x] == 2){
                 let grEat = new  GrassEater(x,y)
                 grassEaterArr.push(grEat)
            }else if(matrix[y][x] ==  3){
                 let pre = new Predator(x,y)
                 predatorArr.push(pre)
            }else if(matrix[y][x] == 4){
                    let flow = new Flower(x,y)
                    flowerArr.push(flow)
            }


    }
}
io.sockets.emit("send matrix",matrix)

}

function game(){
        for (let i in grassArr) {
                grassArr[i].mul()
        }


        for(let i in grassEaterArr){
                grassEaterArr[i].eat()
        }

     

        for(let i in predatorArr){
                predatorArr[i].eat()
        }


        for(let i in flowerArr){
                flowerArr[i].eat()
        }

io.sockets.emit("send matrix",matrix);
}

setInterval(game,200)

function AddGrass(){
       for(let i =0;i < 6;i++){
        let x = Math.floor(Math.random() * matrix[0].length)
        let y = Math.floor(Math.random() * matrix.length)

           matrix[y][x] = 1
           var grass = new Grass(x,y)
            grassArr.push(grass)
       }
}






function AddGrassEater(){
        for(let i =0;i <4;i++){
         let x = Math.floor(Math.random() * matrix[0].length)
         let y = Math.floor(Math.random() * matrix.length)
 
            matrix[y][x] = 1
            var grassEater = new GrassEater(x,y)
             grassEaterArr.push(grassEater)
        }
 }
 
 
 

 function AddPredator(){
        for(let i =0;i <4;i++){
         let x = Math.floor(Math.random() * matrix[0].length)
         let y = Math.floor(Math.random() * matrix.length)
 
            matrix[y][x] = 1
            var predator  = new Predator(x,y)
            predatorArr.push(predator)
        }
 }
 
 function AddFlower(){
        for(let i =0;i <4;i++){
         let x = Math.floor(Math.random() * matrix[0].length)
         let y = Math.floor(Math.random() * matrix.length)
 
            matrix[y][x] = 1
            var flower  = new Flower(x,y)
            flowerArr.push(flower)
        }
 }

 var weath;

 function Winter() {
     weath = "winter";
     io.sockets.emit('Winter', weath);
 }
 
 function Summer() {
     weath = "summer";
     io.sockets.emit('Summer', weath);
 }
 
 function Spring() {
     weath = "spring";
     io.sockets.emit('Spring', weath);
 }
 function Autumn() {
     weath = "autumn";
     io.sockets.emit('Autumn', weath);
 }

 function kill() {
	grassArr = []
        grassEaterArr = []
        predatorArr = []
        flowerArr = []

	for (var y = 0; y < matrix.length; y++) {
		for (var x = 0; x < matrix[y].length; x++) {
			matrix[y][x] = 0;
		}
	}
	io.sockets.emit("matrix", matrix);
}
 
 io.on("connection",function(socket){
        createObject()
        socket.on("spring", Spring);
        socket.on("summer", Summer);
        socket.on("autumn", Autumn);
        socket.on("winter", Winter);
        socket.on("addGrass",AddGrass)
        socket.on("addgrassEater",AddGrassEater)
        socket.on("addPredator",AddPredator)
        socket.on("addFlower",AddFlower)
        socket.on("kill",kill)
})


var statistics = {};
setInterval(function () {
    statistics.grass = grassArr.length;
    statistics.grassEater = grassEaterArr.length;
    statistics.predator = predatorArr.length;
    statistics.flower = flowerArr.length;
    fs.writeFile("statistics.json", JSON.stringify(statistics), function () {
            console.log("statistics");
})
},1000)