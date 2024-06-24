const { append, cons, first, isEmpty, isList, length, rest, map } = require("fl-extended");

const framesPerSecond = 48;
function sketchProc(processing) {
    // se ejecuta 48 veces por segundo.
    processing.draw = function () {

        processing.pushMatrix();//Guarda la matrix actual (con la rotacion y la transformacion que estaba en canvas justo anterior)
        processing.translate(25, 25);
        //processing.translate(0, 25)
        processing.fill(240, 30, 220); // color
        processing.arc(0, 0, 30, 30, 0, 2 * Math.PI)//pacman
        processing.popMatrix();//Restaura la matrix que se guarda en pushMatrix()

        processing.fill(50, 30, 100); // color
        processing.arc(0, 0, 25, 15, 0, 2 * Math.PI)
        //processing.drawGame(processing.state);
    };

    // dibuja algo en el canvas. Aqui se pone todo lo que quieras pintar
}
var canvas = document.getElementById("canvas");
// attaching the sketchProc function to the canvas
var processingInstance = new Processing(canvas, sketchProc);
/*
    processing.state = {

    }
    processing.draw = function () {
        processing.state = processing.onTic(processing.state);
        processing.drawGame(processing.state);
    };

    processing.drawGame = function (world) {
        processing.fill(250, 0, 0)
        processing.rect(0, 0, 30, 30)
    };*/
