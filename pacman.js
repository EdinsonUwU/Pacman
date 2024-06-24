// moverPacman
// mover
// nextPosition
// pacmanSeEncuentraConUnFantasma
// dibujarPacmanAnimado

// DEF: matrix[fila][columna] <-> matrix[y][x]
// DEF: la posicion x,y de un arco se dibuja desde el centro
// DEF: la posicion x,y de un rectangulo se dibuja desde la esquina superior izquierda
// El Math.floor10 hace que se borren errores acomulados en las cifras decimales 14 y 15, lo que hace que se pasen los puntos centrales.

/**
 * muestra la nueva posicion y el nuevo estado en el que se encuentra el pacman 
 * @param {object} pacman 
 * @param {object} world 
 * @return {[pacman,world]}
 */
function moverPacman(pacman, world) {
    let pos = {
        fil: Math.round10((pacman.y - cellSize / 2) / cellSize, -10),
        col: Math.round10((pacman.x - cellSize / 2) / cellSize, -10)
    }
    // verifica si se encuentra con un fantasma
    if (pacmanSeEncuentraConUnFantasma(pacman, [world.pinky, world.blinky, world.clyde, world.inky], world)) 
        return [pacman, Object.assign(world, { time: -framesPerSecond * tiempoDePausa - 1 }, { vidas: world.vidas - 1 })];

    if (isInteger(pos.fil) && isInteger(pos.col)) { //verifica si el pacman se encuentra en un centro
        if (world.matrix[pos.fil][pos.col] == mapa.galleta) { // comer galleta 
            let newWorld = comerGalleta(world, pos);
            return [moverPacman(pacman, newWorld)[0], newWorld];
        }

        if (world.matrix[pos.fil][pos.col] == mapa.galletaG) { // comer galleta grande
            let newWorld = comerGalleta(world, pos);
            return [moverPacman(Object.assign(pacman, { estado: EPacman.SUPER, super: world.time }), newWorld)[0], newWorld];
        }

        if (world.matrix[pos.fil][pos.col] == mapa.fruta) { // comer fruta
            let newWorld = comerFruta(world, pos);
            if (newWorld)
                return [moverPacman(pacman, newWorld)[0], newWorld];
        }
    }

    if (pacman.inputDir)  // si hay una tecla entrante 
        //verifica si la direccion que lleva es inversa a la tecla de dir que se oprime    
        if (pacman.inputDir == direccionInversa(pacman.currentMovement)) 
            return [mover(Object.assign(pacman, { lastDir: pacman.inputDir, currentMovement: pacman.inputDir, inputDir: null })), world];
        else
            return [moverPacman(Object.assign(pacman, { nextMove: pacman.inputDir, inputDir: null }), world)[0], world];

    if (pacman.nextMove) // si pacman se va a mover
        if (isInteger(pos.fil) && isInteger(pos.col)) //si esta en un centro
            if (nextPosition(world.matrix, pos, pacman.nextMove) != mapa.pared) //si no hay pared
                return [mover(Object.assign(pacman, { lastDir: pacman.nextMove, currentMovement: pacman.nextMove, nextMove: null })), world];

    if (pacman.currentMovement) // si pacman se esta moviendo
        if (isInteger(pos.fil) && isInteger(pos.col))
            if (nextPosition(world.matrix, pos, pacman.currentMovement) == mapa.pared) //si hay pared
                return [Object.assign(pacman, { currentMovement: null }), world];

    return [mover(pacman), world]; // mover pacman en la direccion actual
}


/**
 * Cambia la posicion del pacman de acuerdo a la dirección dada
 * @param {pacman} 
 * @return {pacman} 
 */
function mover(personaje) {
    // mover el personaje (fantasma o pacman) un step
    if (personaje.currentMovement == processing.UP)
        return Object.assign(personaje, { y: personaje.y - pacmanStep });

    if (personaje.currentMovement == processing.LEFT)
        return Object.assign(personaje, { x: personaje.x - pacmanStep });

    if (personaje.currentMovement == processing.DOWN)
        return Object.assign(personaje, { y: personaje.y + pacmanStep });

    if (personaje.currentMovement == processing.RIGHT)
        return Object.assign(personaje, { x: personaje.x + pacmanStep });

    if (personaje.currentMovement == null)
        return personaje;
}


/**
 * De acuerdo a la dirección dada, el pacman se posiciona en la siguiente celda
 * @param {world} world
 * @param {integer} pacmanCol
 * @param {integer} pacmanRow
 * @param {dir} direccion
 * @return {cell} 
 */
function nextPosition(matrix, pos, direccion) {
    if (direccion == processing.RIGHT) //se mueve una celda a la izquierda
        return matrix[pos.fil][pos.col + 1];

    if (direccion == processing.LEFT) //se mueve una celda a la derecha
        return matrix[pos.fil][pos.col - 1];

    if (direccion == processing.UP) //se mueve una celda hacia arriba
        return matrix[pos.fil - 1][pos.col];

    if (direccion == processing.DOWN) //se mueve una celda hacia abajo
        return matrix[pos.fil + 1][pos.col];
}


/**
 * determinar si pacman se ha encontrado con un fantasma en el mapa
 * @param {pos} pos hace referencia a la posicion de pacman
 * @param {lista} listaFantasmas
 * @return {bool}
 */
function pacmanSeEncuentraConUnFantasma(pacman, listaFantasmas, world) {
    if (length(listaFantasmas) == 0)
        return false;

    let fantasma = first(listaFantasmas);

    if (puntoContenidoEnUnCuadrado(pacman, fantasma)) {
        if (pacman.estado == EPacman.SUPER) {
            fantasma = inicializarFantasma(world, fantasma, fantasma.letra);
            world.puntaje += 200;
            return false;
        }
        return true;
    }
    else
        return pacmanSeEncuentraConUnFantasma(pacman, rest(listaFantasmas), world);
}


// ----------------------------------------------------------------------------------------------------------------
// ANIMACIÓN
// ----------------------------------------------------------------------------------------------------------------


/**Dibuja el pacman en el mapa (matriz) y se gira de acuerdo a la dirección dada 
 * 
 * @param {world}
 * @param {processing}
 * @return {pacman}
 */
function dibujarPacmanAnimado(world, processing) {
    // dibuja el pacman en el mapa, se incluye la rotacion de acuerdo a la direccion de movimiento
    let pacman = world.pacman;
    // queremos que quepa en el camino, asi que elejimos la menor anchura para que no sobrepase el camino = 0;
    const pacmanSize = cellSize;

    processing.fill(250, 200, 0); // color pacman #FAC800,

    processing.translate(pacman.x, pacman.y); // mueve el centro de rotacion

    if (pacman.lastDir == processing.UP) //gira el pacman hacia arriba
        processing.rotate(radianes(270));

    if (pacman.lastDir == processing.DOWN) //gira el pacman hacia abajo
        processing.rotate(radianes(90));

    if (pacman.lastDir == processing.LEFT) //gira el pacman hacia derecha
        processing.rotate(radianes(180));

    if (pacman.lastDir == processing.RIGHT) //gira el pacman hacia izquierda
        processing.rotate(radianes(0));

        processing.translate(0, 0)
    


    processing.noStroke(); // no dibujar lineas de contorno
    //Dibuja el pacman de acuerdo al tiempo de la animacion 
    if (world.time < 1) dibujarPacmanConArco3(pacmanSize, processing)
    else if (animacion(world.time, 3, 6) < 1) dibujarPacmanCompleto(pacmanSize, processing);
    else if (animacion(world.time, 3, 6) < 2) dibujarPacmanConArco2(pacmanSize, processing);
    else if (animacion(world.time, 3, 6) < 3) dibujarPacmanConArco3(pacmanSize, processing);
    else if (animacion(world.time, 3, 6) < 4) dibujarPacmanConArco(pacmanSize, processing);
    else if (animacion(world.time, 3, 6) < 5) dibujarPacmanConArco3(pacmanSize, processing);
    else dibujarPacmanConArco2(pacmanSize, processing);

    processing.stroke(0); // volver a dibujar las lineas de contorno, color negro

    processing.resetMatrix();
}


//TODO: la funcion animacion da como salida un residuo, esta optimizada para que el frameRate sea 48;
//TODO: la funcion animacion nos dice cuanto tiempo dura cada funcion dibujarPacman.
/**
 * animacion: calcula el tiempo que dura la funcion dibujar el pacman
 * @param {object} time
 * @param {object} velocidadSprite
 * @param {object} numeroDeSprites  
 * @return {number}
 */
function animacion(time, velocidadSprite, numeroDeSprites) {
    return (
        (time / (framesPerSecond / (velocidadSprite * numeroDeSprites))) %
        numeroDeSprites
    );
}


/**
 * dibujarPacmanCompleto: Dibuja el pacman completo
 * @param {object} pacmanSize
 * @param {object} processing  
 * @return {void} 
 */
function dibujarPacmanCompleto(pacmanSize, processing) {
    processing.arc(0, 0, pacmanSize, pacmanSize, 0, radianes(360));
}


/**
 * dibujarPacmanConArco: Dibuja el pacman con arco
 * @param {object} pacmanSize
 * @param {object} processing  
 * @return {void} 
 */
function dibujarPacmanConArco(pacmanSize, processing) {
    processing.arc(0, 0, pacmanSize, pacmanSize, radianes(45), radianes(315));
}


/**
 * dibujarPacmanConArco2: Dibuja el pacman con una segunda animacion de arco
 * @param {object} pacmanSize
 * @param {object} processing  
 * @return {void} 
 */
function dibujarPacmanConArco2(pacmanSize, processing) {
    processing.arc(0, 0, pacmanSize, pacmanSize, radianes(15), radianes(345));
}


/**
 * dibujarPacmanConArco3: Dibuja el pacman con una tercera animacion de arco
 * @param {object} pacmanSize
 * @param {object} processing  
 * @return {void} 
 */
function dibujarPacmanConArco3(pacmanSize, processing) {
    processing.arc(0, 0, pacmanSize, pacmanSize, radianes(30), radianes(330));
}


// ----------------------------------------------------------------------------------------------------------------
// FUNCIONES AUXILIARES
// ----------------------------------------------------------------------------------------------------------------


/**
 * Determinar si un punto (pacman) esta contenido en un cuadrado (fantasmas)
 * @param {pacman} punto 
 * @param {fantasma} fantasma 
 * @return {bool}
 */
function puntoContenidoEnUnCuadrado(punto, fantasma) {
    let conetenidoEnX = punto.x >= fantasma.x && punto.x <= (fantasma.x + cellSize);
    let conetenidoEnY = punto.y >= fantasma.y && punto.y <= (fantasma.y + cellSize);

    if (conetenidoEnX && conetenidoEnY)
        return true;
    else
        return false;
}


/**
 * toma como parametro una angulo (45) y da como salida un radian (PI/4)
 * @param {number} angulo 
 * @return {number} 
 */
function radianes(angulo) {
    return angulo * (Math.PI / 180);
}


/**
 * 
 * @param {*} value 
 */
function isInteger(value) {
    return (
        typeof value === "number" && isFinite(value) && Math.floor(value) === value
    );
}


/**
 * FUENTE: https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Math/round
 * Ajuste decimal de un número.
 * @param	{String}	type	El tipo de ajuste.
 * @param	{Number}	value	El número.
 * @param	{Integer}	exp		El exponente(el logaritmo en base 10 del ajuste).
 * @returns	{Number}			El valor ajustado.
 */
function decimalAdjust(type, value, exp) {
    // Si el exp es indefinido o cero...
    if (typeof exp === "undefined" || +exp === 0) {
        return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // Si el valor no es un número o el exp no es un entero...
    if (isNaN(value) || !(typeof exp === "number" && exp % 1 === 0)) {
        return NaN;
    }
    // Cambio
    value = value.toString().split("e");
    value = Math[type](+(value[0] + "e" + (value[1] ? +value[1] - exp : -exp)));
    // Volver a cambiar
    value = value.toString().split("e");
    return +(value[0] + "e" + (value[1] ? +value[1] + exp : exp));
}


// FUENTE: https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Math/round
if (!Math.round10) {
    Math.round10 = function (value, exp) {
        return decimalAdjust("round", value, exp);
    };
}