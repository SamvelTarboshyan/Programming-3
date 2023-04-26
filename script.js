var socket = io()
var side = 30


function setup() {
        createCanvas(25 * side, 25 * side)
       

}


function nkarel(matrix) {
        for (let y = 0; y < matrix.length; y++) {
                for (let x = 0; x < matrix[y].length; x++) {
                        if (matrix[y][x] == 1) {
                                fill("green")
                        } else if(matrix[y][x] == 2){
                                fill ("orange")
                        }else if(matrix[y][x] == 3){
                                fill ("red")
                        }else if(matrix[y][x] == 4){
                                fill ("pink")
                        }else if(matrix[y][x] == 11){
                                fill ("violet")
                        }
                        else {
                                fill("gray")
                        }
                        rect(x * side, y * side, side, side)

                }
        }
}



socket.on("send matrix",nkarel)


function kill(){
        socket.emit("kill") 
 }

function AddGrass(){
       socket.emit("addGrass") 
}

function AddGrassEater(){
        socket.emit("addgrassEater") 
 }

 function AddPredator(){
        socket.emit("addPredator") 
 }
 function AddFlower(){
        socket.emit("addFlower") 
 }

