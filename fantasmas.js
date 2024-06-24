// moverFantasma
// nuevaDirrecionDelFantasma
// dibujarFantasma

/**
 * mueve el fantasma a traves del mapa de manera aleatoria
 * @param {fantasma} fantasma
 * @param {world} world 
 * @return {fantasma}
 */
function moverFantasma(fantasma, world) {
    let pos = {
        fil: Math.round10(fantasma.y / cellSize, -10),  // convierte a entero la posicion del fantasma
        col: Math.round10(fantasma.x / cellSize, -10)   // convierte a entero la posicion del fantasma
    }

    let pacmanPos = {
        fil: Math.round10((world.pacman.y - cellSize / 2) / cellSize, -10), // convierte a entero la posicion del pacman
        col: Math.round10((world.pacman.x - cellSize / 2) / cellSize, -10)  // convierte a entero la posicion del pacman
    }

    if (isInteger(pos.fil) && isInteger(pos.col)) {  //si la posicion es un centro
        let newDir = nuevaDirrecionDelFantasma(world, pos, pacmanPos, fantasma.currentMovement, fantasma.acosador);
        return mover(Object.assign(fantasma, { currentMovement: newDir }));
    }

    return mover(fantasma);
}


/**
 * Retornar una dirección posible en la que el fantasma se pueda mover
 * @param {world} world 
 * @param {integer} fantasmaCol 
 * @param {integer} fantasmaRow
 * @return {dir} 
 */
// se llama solo cuando hay una pared y esta en un centro
function nuevaDirrecionDelFantasma(world, pos, pacmanPos, currentMovement, porcentajeAcosar) {
    let distanciaRIGHT = distancia({ x: pacmanPos.col, y: pacmanPos.fil }, { x: pos.col + 1, y: pos.fil });
    let distanciaLEFT = distancia({ x: pacmanPos.col, y: pacmanPos.fil }, { x: pos.col - 1, y: pos.fil });
    let distanciaUP = distancia({ x: pacmanPos.col, y: pacmanPos.fil }, { x: pos.col, y: pos.fil - 1 });
    let distanciaDOWN = distancia({ x: pacmanPos.col, y: pacmanPos.fil }, { x: pos.col, y: pos.fil + 1 });

    var posiblesMovimientos = []; // el fantasma verifica que posiciones posibles tiene para moverse
    if (nextPosition(world.matrix, pos, processing.RIGHT) != mapa.pared && direccionInversa(currentMovement) != processing.RIGHT)
        posiblesMovimientos.push({ dir: processing.RIGHT, dis: distanciaRIGHT });
    if (nextPosition(world.matrix, pos, processing.UP) != mapa.pared && direccionInversa(currentMovement) != processing.UP)
        posiblesMovimientos.push({ dir: processing.UP, dis: distanciaUP });
    if (nextPosition(world.matrix, pos, processing.DOWN) != mapa.pared && direccionInversa(currentMovement) != processing.DOWN)
        posiblesMovimientos.push({ dir: processing.DOWN, dis: distanciaDOWN });
    if (nextPosition(world.matrix, pos, processing.LEFT) != mapa.pared && direccionInversa(currentMovement) != processing.LEFT)
        posiblesMovimientos.push({ dir: processing.LEFT, dis: distanciaLEFT });

    if (length(posiblesMovimientos) == 0) {
        return direccionInversa(currentMovement); //cambia la direccion por la direccion inversa
    }
    else {
        let movimientoAleatorio = Math.random() * 100;
        //si el movimiento aleatorio es mayor que el porcentaje a seguir, que se elija entre los elemntos de la lista de posibles
        // elementos de forma aleatoria 
        if (movimientoAleatorio > porcentajeAcosar) {
            let eleccionAleatoria = Math.floor(Math.random() * length(posiblesMovimientos)); // elige una direccion aleatoria
            return posiblesMovimientos[eleccionAleatoria].dir;
        }
        if (world.pacman.estado == EPacman.SUPER)
            return mayorDeLaLista(posiblesMovimientos).dir; // se aleja en un cruce, (da la direccion mas alejada del pacman)
        else
            return menorDeLaLista(posiblesMovimientos).dir; // se acerca en un cruce, (da la direccion mas acercada del pacman)
    }
}


/**
 * Dibuja un fantasma, dependiendo el tipo de fantasma que se le pasa
 * @param {fantasma} fantasma 
 * @param {imagen} imagen1
 * @param {imagen} imagen2 
 * @param {world} world 
 * @param {processing} processing 
 * @return {void}
 */
function dibujarFantasma(fantasma, imagen1, imagen2, world, processing) {
    canvas.getContext("2d").globalAlpha = 1;
    if (world.pacman.estado == EPacman.SUPER) // si el estado de pacman es SUPER, se dibuja un fantasma asustado (imagen2)
        processing.image(imagen2, fantasma.x, fantasma.y, cellSize, cellSize);
    else
        processing.image(imagen1, fantasma.x, fantasma.y, cellSize, cellSize); // de lo contrario dibuja un fantasma normal (imagen1)
    canvas.getContext("2d").globalAlpha = 1;
}


// ----------------------------------------------------------------------------------------------------------------
// FUNCIONES AUXILIARES
// ----------------------------------------------------------------------------------------------------------------


/**
 * retorna la direccion inversa a la direccion que lleva
 * @param {*} dir 
 * @return {dir}
 */
function direccionInversa(dir) {
    if (dir == processing.RIGHT)
        return processing.LEFT
    if (dir == processing.LEFT)
        return processing.RIGHT
    if (dir == processing.UP)
        return processing.DOWN
    if (dir == processing.DOWN)
        return processing.UP
    if (dir == null)
        return null
}


/**
 * verifica la distancia entre dos puntos 
 * @param {integer} a 
 * @param {integer} b 
 * @return {integer}
 */
function distancia(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}


/**
 * encuentra el elemento cuya distancia es menor en la lista dada
 * @param {lista} lista 
 * @return {object} { dir: dir, dis: number }
 */
function menorDeLaLista(lista) {
    if (length(lista) == 1)
        return first(lista);

    let primerElemento = first(lista);
    let segundoElemento = first(rest(lista));
    if (primerElemento.dis < segundoElemento.dis)
        return menorDeLaLista(cons(primerElemento, rest(rest(lista)))); // quitar el segundo elemento de la lista
    else
        return menorDeLaLista(rest(lista)); // quitar el primer elemento
}

/**
 * encuentra el elemento cuya distancia es mayor en la lista dada
 * @param {lista} lista 
 * @return {object} { dir: dir, dis: number }
 */
function mayorDeLaLista(lista) {
    if (length(lista) == 1)
        return first(lista);

    let primerElemento = first(lista);
    let segundoElemento = first(rest(lista));
    if (primerElemento.dis > segundoElemento.dis)
        return mayorDeLaLista(cons(primerElemento, rest(rest(lista)))); // quitar el segundo elemento de la lista
    else
        return mayorDeLaLista(rest(lista)); // quitar el primer elemento
}