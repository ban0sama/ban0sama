var canvas = $("#canvas")[0];
var ctx = canvas.getContext('2d');

var scoreLabel = $("#score");

var score = 0;
var bestScore = localStorage.getItem('score2048');
var size = 4;
var width = canvas.width / size - 6;

var cells = [];
var fontSize;
var loss = false;


function canvasClear(){
    ctx.clearRect(0,0,500,500);
}

$(".reset").click(function(){
  $(".lose").css({"display":"none"});
  canvas.style.opacity = '1';
  startGame();
});

$("canvas").css({"display":"none"});
$(".start2").click(function(){
  $("canvas").css({"display":"block"});
  startGame();
  $(".start2").css({"display":"none"});
});

if(bestScore != null || bestScore != undefined) $("#bestScore").html("Best score: "+bestScore);
else $("#bestScore").html("Best score: 0");

function startGame(){
    createCells();
    drawAllCells();
    pasteNewCell();
    pasteNewCell();
}

function finishGame() {
    localStorage.setItem('score2048', this.score);
    canvas.style.opacity = '0.3';
    lose = true;
    $(".lose").css({"display":"block"});
}

function cell(row, col){
    this.value = 0;
    this.x = col * width + 5 * (col+1);
    this.y = row * width + 5 * (row+1);
}

function createCells(){
   for(var i=0; i<size; i++){
      cells[i] = [];
      for(var j=0; j<size; j++){
          cells[i][j] = new cell(i,j);
      } 
   } 
}

function drawCell(cell){
   ctx.beginPath();
   ctx.rect(cell.x, cell.y, width, width);

   var fontColor;

   ctx.fillStyle = "#ffebcd";

   switch(cell.value){
       case 0 : ctx.fillStlye = "rgb(5,5,5)"; fontColor = "black"; break;
       case 2 : ctx.fillStyle = "#faebd7" ; fontColor = "black"; break;
       case 4 : ctx.fillStyle = "#ffe4c4"; fontColor = "black"; break;
       case 8 : ctx.fillStyle = "#deb887"; fontColor = "black"; break;
       case 16 : ctx.fillStyle = "#ff7f50"; fontColor = "black"; break;
       case 32 : ctx.fillStyle = "rgb(202,77,64)"; fontColor = "black"; break;
       case 64 : ctx.fillStyle = "#a52a2a"; fontColor = "black"; break;
       case 128 : ctx.fillStyle = "rgb(207,126,63)"; fontColor = "black"; break;
      case 256 : ctx.fillStyle = "rgb(82,125,124)"; fontColor = "black"; break;
       case 512 : ctx.fillStyle = "rgb(191,76,134)"; fontColor = "black"; break;
       case 1024 : ctx.fillStyle = "rgb(119,41,92)"; fontColor = "black"; break;
       case 2048 : ctx.fillStyle = "rgb(118,179,194)"; fontColor = "black"; break;
       case 4096 : ctx.fillStyle = "rgb(52,63,79)"; fontColor = "black"; break;
       default : ctx.fillStyle = "#ffebcd"; fontColor = "black"; 
   }

   ctx.fill();
   if(cell.value){
       fontSize = width/2;
       ctx.font = fontSize + "px Viga";
       ctx.fillStyle = fontColor;
       ctx.textAlign = "center";
      //  ctx.textBaseline = "middle";
       ctx.fillText(cell.value, cell.x+width/2, cell.y+width/1.5);
   }
}

function drawAllCells(){
    for(var i=0; i<size; i++){
        for(var j=0; j<size; j++){
            drawCell(cells[i][j]);
        }
    }
}

function pasteNewCell(){
    var countFree = 0;
    var i, j;
    for(i = 0; i < size; i++) {
        for(j = 0; j < size; j++) {
        if(!cells[i][j].value) {
            countFree++;
        }
        }
    }
    if(!countFree) {
        finishGame();
        return;
    }
    while(true){
        var row = Math.floor(Math.random()*size);
        var col = Math.floor(Math.random()*size);
        if(!cells[row][col].value){
            cells[row][col].value = 2 * Math.ceil(Math.random()*2);
            drawAllCells();
            return;
        }
    }
}

var startX, startY, endX, endY;

$("#canvas").on('mousedown', function(e) {
    startX = e.pageX;
    startY = e.pageY;
});

$("#canvas").on('mouseup', function(e) {
    endX = e.pageX;
    endY = e.pageY;
    handleSwipe();
});

function handleSwipe() {
    var diffX = endX - startX;
    var diffY = endY - startY;
    var absDiffX = Math.abs(diffX);
    var absDiffY = Math.abs(diffY);

    if (absDiffX > absDiffY) {
        if (diffX > 0) {
            // Right swipe
            moveRight();
        } else {
            // Left swipe
            moveLeft();
        }
    } else {
        if (diffY > 0) {
            // Down swipe
            moveDown();
        } else {
            // Up swipe
            moveUp();
        }
    }

    // Update the score
    scoreLabel.html("Score: " + score);
}

function moveRight () {
    var i, j;
    var col;
    for(i = 0; i < size; i++) {
      for(j = size - 2; j >= 0; j--) {
        if(cells[i][j].value) {
          col = j;
          while (col + 1 < size) {
            if (!cells[i][col + 1].value) {
              cells[i][col + 1].value = cells[i][col].value;
              cells[i][col].value = 0;
              col++;
            } else if (cells[i][col].value == cells[i][col + 1].value) {
              cells[i][col + 1].value *= 2;
              score +=  cells[i][col + 1].value;
              cells[i][col].value = 0;
              break;
            } else {
              break;
            }
          }
        }
      }
    }
    pasteNewCell();
  }
  
  function moveLeft() {
    var i, j;
    var col;
    for(i = 0; i < size; i++) {
      for(j = 1; j < size; j++) {
        if(cells[i][j].value) {
          col = j;
          while (col - 1 >= 0) {
            if (!cells[i][col - 1].value) {
              cells[i][col - 1].value = cells[i][col].value;
              cells[i][col].value = 0;
              col--;
            } else if (cells[i][col].value == cells[i][col - 1].value) {
              cells[i][col - 1].value *= 2;
              score +=   cells[i][col - 1].value;
              cells[i][col].value = 0;
              break;
            } else {
              break; 
            }
          }
        }
      }
    }
    pasteNewCell();
  }
  
  function moveUp() {
    var i, j, row;
    for(j = 0; j < size; j++) {
      for(i = 1; i < size; i++) {
        if(cells[i][j].value) {
          row = i;
          while (row > 0) {
            if(!cells[row - 1][j].value) {
              cells[row - 1][j].value = cells[row][j].value;
              cells[row][j].value = 0;
              row--;
            } else if (cells[row][j].value == cells[row - 1][j].value) {
              cells[row - 1][j].value *= 2;
              score +=  cells[row - 1][j].value;
              cells[row][j].value = 0;
              break;
            } else {
              break; 
            }
          }
        }
      }
    }
    pasteNewCell();
  }
  
  function moveDown() {
    var i, j, row;
    for(j = 0; j < size; j++) {
      for(i = size - 2; i >= 0; i--) {
        if(cells[i][j].value) {
          row = i;
          while (row + 1 < size) {
            if (!cells[row + 1][j].value) {
              cells[row + 1][j].value = cells[row][j].value;
              cells[row][j].value = 0;
              row++;
            } else if (cells[row][j].value == cells[row + 1][j].value) {
              cells[row + 1][j].value *= 2;
              score +=  cells[row + 1][j].value;
              cells[row][j].value = 0;
              break;
            } else {
              break; 
            }
          }
        }
      }
    }
    pasteNewCell();
  }