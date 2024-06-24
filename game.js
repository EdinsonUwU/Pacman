/**
 * @param {number}
 * @param {bool}
 * @param {string}
 * @param {object}
 * @param {void}
 * @param {pacman}
 * @param {world}
 * @param {fantasma}
 * @param {integer}
 * @param {dir} : {UP|DOWN|RIGHT|LEFT|null}
 * @param {cell} : {1|0|"p"|2}
 * @param {matrix}
 * @param {lista}
 * @param {processing}
 * @param {image}
 * @param {function}
 */

// TODO: que todos inviertan su direccion cuando huye
// TODO: muerte tienen que huir al centro solo los ojos
// TODO: puerta para la celda de los fantasmas
// TODO: velocidades de los fantasmas

const { append, cons, first, isEmpty, isList, length, rest, map } = require("fl-extended");

const P = "p"; // pacman
const R = "r"; // blinky
const A = "a"; // inky
const I = "pi"; // pinky
const F = "f"; // fruta
const C = "c"; // clyde
const G = 3; // galleta grande

const mapa = {
	size: {
		width: 888,
		height: 555,
	},
	pared: 1,
	camino: 2,
	galleta: 0,
	galletaG: 3,
	pacman: "p",
	fruta: "f"
};

const cellSize = 37; // DETERMINAR EL TAMAÑO EN PIXELES DE CADA CELDA
const pacmanStep = cellSize / 16; // es igual a partes igual de cellSizeWidth para que nos posicione en un centro de las celdas
const framesPerSecond = 48;  //el mundo se dibuja en 48 veces por segundo
const processing = { RIGHT: 39, LEFT: 37, UP: 38, DOWN: 40 };
const EPacman = { DEAD: 0, ALIVE: 1, SUPER: 2 };
const pantallaEstadoDelJuego = document.getElementById("game-status"); // muestra vidas y puntaje
const tiempoDePausa = 3; // tiempo de espera del mundo
play = false;

// ----------------------------------------------------------------------------------------------------------------
// MAIN
// ----------------------------------------------------------------------------------------------------------------

function sketchProc(processing) {

	// esto se llama antes de iniciar el juego
	processing.setup = function () { //se ejecuta una vez cuando se inicia el juego
		processing.frameRate(framesPerSecond); //se actualiza 48 veces por segundo
		processing.size(mapa.size.width, mapa.size.height); //tamaño del mapa

		coinImage = processing.loadImage("images/coin3.png");
		coinImage1 = processing.loadImage("images/coin.png");

		pinkyImage = processing.loadImage("images/pinky-1.png");
		blinkyImage = processing.loadImage("images/blinky-1.png");
		inkyImage = processing.loadImage("images/inky-1.png");
		clydeImage = processing.loadImage("images/clyde-1.png");

		pirataImage = processing.loadImage("images/asustado-2.png");

		cerezaImage = processing.loadImage("images/cereza.png");
		died = processing.loadImage("images/you lose.png");
		win = processing.loadImage("images/you win.jpg");
		pasillo = processing.loadImage("images/pasillo.png")
		Muros1 = processing.loadImage("images/Muros1.png")
		Muros2 = processing.loadImage("images/Muros2.png")
		Muros3 = processing.loadImage("images/Muros5.png")
		Muros4 = processing.loadImage("images/Muros4.png")
		Muros7 = processing.loadImage("images/Muros7.png")
		Muros9 = processing.loadImage("images/Muros9.png")

		processing.state = { //estado inicial del juego 
			time: -framesPerSecond * tiempoDePausa - 1,
			pacman: {
				x: 0,
				y: 0,
				currentMovement: null,
				nextMove: null,
				lastDir: null,
				inputDir: null,
				estado: EPacman.ALIVE,
				super: 0
			},
			puntaje: 0,
			vidas: 3,
			matrix: [
				[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
				[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 1, 1, 1, 1, 1, 1],
				[1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1],
				[1, 0, 0, 0, 0, 1, G, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, G, 1],
				[1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
				[1, 0, 0, 0, 0, 1, 0, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 0, 1, 0, 1],
				[1, 0, 1, 1, 0, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 0, 1, 1, 1, 0, 1],
				[1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, R, A, I, C, 2, 1, 2, 0, 0, 0, 0, 0, 1],
				[1, 0, 1, 1, 0, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 0, 1],
				[1, 0, 0, 0, 0, 0, 1, 0, 0, 2, 2, 2, 2, F, 2, 2, 2, 2, 0, 0, 1, 0, 0, 1],
				[1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1],
				[1, 0, G, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1],
				[1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, G, 1],
				[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, P, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
				[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
			],
			blinky: {
				x: 0,
				y: 0,
				currentMovement: processing.RIGHT,
				acosador: 65,
				letra: R
			},
			inky: {
				x: 0,
				y: 0,
				currentMovement: processing.DOWN,
				acosador: 50,
				letra: A
			},
			pinky: {
				x: 0,
				y: 0,
				currentMovement: processing.UP,
				acosador: 40,
				letra: I
			},
			clyde: {
				x: 0,
				y: 0,
				currentMovement: processing.LEFT,
				acosador: 30,
				letra: C
			},
			numeroDeGalletas: 0
		};
		processing.state.numeroDeGalletas = contarGalletas(processing.state.matrix);//inicia en 0, y luego se asigna el valor de la funcion contarGalletas

		// enfocar el canvas al inicio
		document.getElementById("canvas").focus();
	};


	// se ejecuta 48 veces por segundo.
	processing.draw = function () {
		if (play) {
			processing.state = processing.onTic(processing.state);
			processing.drawGame(processing.state);
		}
	};


	// dibuja algo en el canvas. Aqui se pone todo lo que quieras pintar
	processing.drawGame = function (world) {
		dibujarMapa(world, processing);

		dibujarPacmanAnimado(world, processing);
		dibujarFantasma(world.blinky, blinkyImage, pirataImage, world, processing);
		dibujarFantasma(world.pinky, pinkyImage, pirataImage, world, processing);
		dibujarFantasma(world.inky, inkyImage, pirataImage, world, processing);
		dibujarFantasma(world.clyde, clydeImage, pirataImage, world, processing);

		actualizarVidasPuntaje(world);

		if (world.numeroDeGalletas == 0) { //muestra la imagen died "muerte de pacman"
			processing.background(255, 255, 255);
			processing.image(win, 131, -35, 626, 626);
		}

		if (world.vidas == 0)
			processing.image(died, 131, -35, 626, 626);

		if (world.vidas == 0 || world.numeroDeGalletas == 0) //pone vidas y puntaje en cero
			$(pantallaEstadoDelJuego).css("display", "none");

	};


	// actualiza el mundo en cada tic del reloj. Retorna el nuevo estado del mundo
	processing.onTic = function (world) {
		if (world.vidas == 0 || world.numeroDeGalletas == 0)  // condicion de perder y condicion de ganar
			return world;

		if (world.time == -framesPerSecond * tiempoDePausa - 1) // cambia en el mundo el numero de galletas y aumenta el tiempo en 1
			return Object.assign(world, { numeroDeGalletas: contarGalletas(processing.state.matrix) }, { time: world.time + 1 });

		if (world.time == -framesPerSecond * tiempoDePausa) { // inicializar los personajes del juego
			return Object.assign(world,
				{ time: world.time + 1, },
				{
					pacman: inicializarPacman(world),
					blinky: inicializarFantasma(world, world.blinky, R),
					inky: inicializarFantasma(world, world.inky, A),
					clyde: inicializarFantasma(world, world.clyde, C),
					pinky: inicializarFantasma(world, world.pinky, I),
				}
			);
		}

		if (world.time < 1)  // tiempo de pausa
			return Object.assign(world, { time: world.time + 1 });

		let [pacman, newWorld] = moverPacman(world.pacman, world);
		let blinky = moverFantasma(world.blinky, world);
		let inky = moverFantasma(world.inky, world);
		let clyde = moverFantasma(world.clyde, world);
		let pinky = moverFantasma(world.pinky, world);

		if (world.pacman.estado == EPacman.SUPER && world.time > world.pacman.super + framesPerSecond * 10) // duracion del estado SUPER del pacman
			pacman.estado = EPacman.ALIVE;

		return Object.assign(world, newWorld, { time: world.time + 1 }, { pacman: pacman, blinky: blinky, inky: inky, pinky: pinky, clyde: clyde });
	};


	// actualiza el mundo cada vez que se oprime una tecla. Retorna el nuevo estado del mundo
	processing.onKeyEvent = function (world, keyCode) {
		let pacman = world.pacman;
		switch (keyCode) {
			case processing.UP:
				return Object.assign(world, { pacman: Object.assign(pacman, { inputDir: processing.UP }) });

			case processing.DOWN:
				return Object.assign(world, { pacman: Object.assign(pacman, { inputDir: processing.DOWN }) });

			case processing.LEFT:
				return Object.assign(world, { pacman: Object.assign(pacman, { inputDir: processing.LEFT }) });

			case processing.RIGHT:
				return Object.assign(world, { pacman: Object.assign(pacman, { inputDir: processing.RIGHT }) });

			default:
				return world;
		}
	};


	// esta función se ejecuta cada vez que presionamos una tecla.
	processing.keyPressed = function () {
		processing.state = processing.onKeyEvent(processing.state, processing.keyCode);
	};
}

var canvas = document.getElementById("canvas");
var processingInstance = new Processing(canvas, sketchProc);


// ----------------------------------------------------------------------------------------------------------------
// FUNCIONES AUXILIARES
// ----------------------------------------------------------------------------------------------------------------


/**
* imprime en pantalla los valores de vida y puntaje del pacman
* @param {world} world
* @return {void} 
*/
function actualizarVidasPuntaje(world) {
	$(pantallaEstadoDelJuego).find("#vidas").html(world.vidas);
	$(pantallaEstadoDelJuego).find("#puntaje").html(world.puntaje);
}