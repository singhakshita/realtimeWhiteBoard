//const socket = io.connect("http://localhost:3000");
//https://whiteboard-akshita.herokuapp.com/
const socket = io.connect("https://whiteboard-akshita.herokuapp.com/");
console.log("socket");
console.log(socket);

 let isPenDown = false;
 let points =[];
 let RedoArr = [];
board.addEventListener("mousedown" ,function(event){
    let x = event.clientX;
    let y = event.clientY;
    let top = getTop();
    y = y - top;
    ctx.beginPath();
    ctx.moveTo(x,y);
    isPenDown = true;
    let mousedownPoint ={
        x : x,
        y : y,
        id : "md",
        color : ctx.strokeStyle,
        width : ctx.lineWidth
    }
    points.push(mousedownPoint);
    socket.emit("md" ,mousedownPoint);


})
board.addEventListener("mousemove" ,function(event){
    let x = event.clientX;
    let y = event.clientY;
    let top = getTop();
    y = y - top;
    if(isPenDown){
     ctx.lineTo(x,y);
     ctx.stroke();
     let mousemovePoint ={
         x : x,
         y : y,
         id : "mm",
         color : ctx.strokeStyle,
         width : ctx.lineWidth
     }
     points.push(mousemovePoint);
     socket.emit("mm" ,mousemovePoint);
    }
})
window.addEventListener("mouseup" ,function(event){
    isPenDown = false;
})

function getTop(){
   let  { top } = board.getBoundingClientRect();
    return top;
}

function reDraw(){
    for( let i=0;i<points.length ;i++){
        let { x, y , id , color ,width} = points[i];
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        if( id == "md"){
            ctx.beginPath();
            ctx.moveTo(x,y);
        }
        else if( id == "mm"){
            ctx.lineTo(x,y);
            ctx.stroke();
        }
    }
}
function undoMaker(){
    if( points.length >= 2){
        let  tempArr = [];
       for( let i = points.length-1 ;i>=0 ;i--){
           let { id } =points[i];
           if( id == "md"){
                tempArr.unshift(points.pop());
               break;
           }
           else{
            tempArr.unshift(points.pop());
           }
       } 
       RedoArr.push(tempArr);
   }
   ctx.clearRect( 0 ,0 ,board.width ,board.height);
   reDraw();

}

function redoMaker(){
    if( RedoArr.length >0){
        let myRedoArr = RedoArr.pop();
        points.push(...myRedoArr);
        ctx.clearRect( 0 ,0 ,board.width ,board.height);
        reDraw();
    }
}
///////////////////////////////////////tool////////////////////////////////
//const socket = io.connect("http://localhost:3000");

let pencil = document.querySelector("#pencil");
let eraser = document.querySelector("#eraser");
let undo   = document.querySelector("#undo");
let redo   = document.querySelector("#redo");
let pencilOption = document.querySelector("#pencil-tools");
let eraserOption = document.querySelector("#eraser-tools");
let sliders = document.querySelectorAll("input[type='range']");
let colors = document.querySelector("input[type='color']");
let activeTool = "pencil";
let pencilsize = 5;
let erasersize = 5;

pencil.addEventListener("click" , function(){
    if( activeTool == "pencil"){
       pencilOption.classList.add("show");
    }
    else{
        activeTool = "pencil";
        eraserOption.classList.remove("show");
        ctx.strokeStyle ="black";
        ctx.lineWidth = pencilsize;
    }
})
eraser.addEventListener("click" , function(){
    ctx.strokeStyle = "white" ;
    if( activeTool == "eraser"){
        eraserOption.classList.add("show");
     }
     else{
         activeTool = "eraser",
         pencilOption.classList.remove("show");
         ctx.lineWidth = erasersize;
     }
})
undo.addEventListener("click" , function(){
    undoMaker();
})
redo.addEventListener("click" , function(){
    redoMaker();
})
sliders.forEach( function(slider){
    slider.addEventListener("change" ,function(){
        let value = slider.value;
        ctx.lineWidth = value;
        if( activeTool == "pencil"){
            pencilsize = ctx.lineWidth;
        }
        else{
            erasersize = ctx.lineWidth;
        }
    })
})
colors.addEventListener("change" ,function(){
    if( activeTool == "pencil"){
    let mycolor = colors.value;
    ctx.strokeStyle = mycolor;
    socket.emit("color" , mycolor);
    }
})



