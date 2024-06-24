/*

if (thereIsABlockNow) {
            //!verficia si la direccion que elije el usuario es un camino o una pared
            //cuando respecta a la direccion actual hay una pared, debe animarse con el currentMovement justo anterior
            if (pacman.nextMove == pacman.currentMovement) {
                //Verificar si el movimiento elejido por el usuario es igual al actual
                return Object.assign(pacman, { nextMove: null });
            }
            if (thereIsABlockNext) {
                return Object.assign(pacman, { nextMove: null });
            }
            if (pacman.nextMove == null) {
                return pacman;
            }
        }

*/

/**
 * Retornar un numero al azar entre 37 y 40, que equivale a las 4 direcciones que existen
 * @return {dir} 
 */
function nuevaDirrecionAleatoria() {
    let direccionFant = Math.round((Math.random() * 3) + 37)
    return direccionFant;
}


/**
 * Es para elegir para cual esquina queremos que se vayan cada fantasma, retorna para el primer fantasma la mayor probabilidad
 * @param {fantasma} fantasma1 
 * @param {fantasma} fantasma2 
 * @param {fanstasma} fantasma3 
 * @param {fantasma} fantasma4 
 */
function nuevaDirrecionAleatoriaConPesos(world, fantasma, dir, porcentaje) {
    let eleccion = Math.round(Math.random() * 100)
    if (eleccion < porcentaje) {
        return dir;
    } else {
        return Math.round((Math.random() * 3) + 37);
    }
}

/**
 * Pinky tiende trampas a pacman, para eso se busca hacer a la siguiente celda a la cual se va a dirigir pacman
 * hagamos que se acerque a la posicion pacmanCol,pacmanRow.
 * //!la function nexPosition no nos sirve aqui, necesitamos una nueva funcion que nos de segun una direccion la nueva posicion a la que queremos movernos
 * @param {fantasma} fantasma 
 * @param {world} world 
 * @return {fantasma}
 */


function moverPinky(fantasma, world) {
    let pacman = world.pacman;
    let pacmanSize = cellSizeWidth;
    let pacmanRow = Math.round10((pacman.y - pacmanSize / 2) / cellSizeHeight, -10); // fila con decimales, ejem: 1.12
    let pacmanCol = Math.round10((pacman.x - pacmanSize / 2) / cellSizeWidth, -10);

    let fantasmaRow = Math.round10(fantasma.y / cellSizeHeight, -10);
    let fantasmaCol = Math.round10(fantasma.x / cellSizeWidth, -10);

    function distancia(a, b) {
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    }/*
    let distanciaRIGHT = distancia(dirigirse(pacmanCol, pacmanRow, processing.RIGHT), { x: fantasmaCol, y: fantasmaRow })
    let distanciaLEFT = distancia(dirigirse(pacmanCol, pacmanRow, processing.LEFT), { x: fantasmaCol, y: fantasmaRow })
    let distanciaDOWN = distancia(dirigirse(pacmanCol, pacmanRow, processing.DOWN), { x: fantasmaCol, y: fantasmaRow })
    let distanciaUP = distancia(dirigirse(pacmanCol, pacmanRow, processing.UP), { x: fantasmaCol, y: fantasmaRow })*/
    let distanciaRIGHT = distancia({ x: pacmanCol, y: pacmanRow }, { x: fantasmaCol + 1, y: fantasmaRow })
    let distanciaLEFT = distancia({ x: pacmanCol, y: pacmanRow }, { x: fantasmaCol - 1, y: fantasmaRow })
    let distanciaUP = distancia({ x: pacmanCol, y: pacmanRow }, { x: fantasmaCol, y: fantasmaRow - 1 })
    let distanciaDOWN = distancia({ x: pacmanCol, y: pacmanRow }, { x: fantasmaCol, y: fantasmaRow + 1 })


    /*************************************************************************************************************** */

    //!QUe el pacman no verifique si se puede mover cuando tiene una pared en el frente si no en cada centro.
    if (isInteger(fantasmaRow) && isInteger(fantasmaCol) && (fantasmaCol == pacmanCol || fantasmaRow == pacmanRow)) { // centro de una celda
        let thereIsAPathRIGHT = nextPosition(world, fantasmaCol, fantasmaRow, processing.RIGHT) != mapa.pared;
        let thereIsAPathLEFT = nextPosition(world, fantasmaCol, fantasmaRow, processing.LEFT) != mapa.pared;
        let thereIsAPathUP = nextPosition(world, fantasmaCol, fantasmaRow, processing.UP) != mapa.pared;
        let thereIsAPathDOWN = nextPosition(world, fantasmaCol, fantasmaRow, processing.DOWN) != mapa.pared;
        console.log(thereIsAPathRIGHT)
        console.log(thereIsAPathLEFT)
        console.log(distanciaUP)
        console.log(distanciaDOWN)
        console.log(fantasmaCol == pacmanCol || fantasmaRow == pacmanRow)
        console.log(fantasmaCol == pacmanCol)
        console.log(fantasmaRow == pacmanRow)
        if (distanciaRIGHT < distanciaLEFT && thereIsAPathRIGHT)
            return moverPacmanUnStep(Object.assign(fantasma, { currentMovement: processing.RIGHT }))
        if (distanciaLEFT < distanciaRIGHT && thereIsAPathLEFT)
            return moverPacmanUnStep(Object.assign(fantasma, { currentMovement: processing.LEFT }))
        if (distanciaLEFT == distanciaRIGHT && thereIsAPathUP && distanciaUP < distanciaDOWN)
            return moverPacmanUnStep(Object.assign(fantasma, { currentMovement: processing.UP }))
        if (distanciaLEFT == distanciaRIGHT && thereIsAPathDOWN && distanciaDOWN < distanciaUP)
            return moverPacmanUnStep(Object.assign(fantasma, { currentMovement: processing.DOWN }))

        return moverFantasma(fantasma, world)

    }
    if (isInteger(fantasmaRow) && isInteger(fantasmaCol) && (fantasmaCol != pacmanCol && fantasmaRow != pacmanRow)) {
        let thereIsAPathRIGHT = nextPosition(world, fantasmaCol, fantasmaRow, processing.RIGHT) != mapa.pared;
        let thereIsAPathLEFT = nextPosition(world, fantasmaCol, fantasmaRow, processing.LEFT) != mapa.pared;
        let thereIsAPathUP = nextPosition(world, fantasmaCol, fantasmaRow, processing.UP) != mapa.pared;
        let thereIsAPathDOWN = nextPosition(world, fantasmaCol, fantasmaRow, processing.DOWN) != mapa.pared;

        return moverFantasma(fantasma, world)
    }

    return moverPacmanUnStep(fantasma);
}


/**
 * 
 * @param {*} fantasmaCol 
 * @param {*} fantasmaRow 
 * @param {*} dir 
 * @param {*} world 
 * @param {*} currentMovement 
 * @return 
 */
function nuevaDirrecionValida(fantasmaCol, fantasmaRow, dir, world, currentMovement, i) {
    if (i > 7)
        return direccionInversa(currentMovement);

    if (dir == direccionInversa(currentMovement))
        return nuevaDirrecionValida(fantasmaCol, fantasmaRow, nuevaDirrecionAleatoria(), world, currentMovement, i + 1);

    if (nextPosition(world, fantasmaCol, fantasmaRow, dir, world, currentMovement) != mapa.pared)
        return dir;
    else
        return nuevaDirrecionValida(fantasmaCol, fantasmaRow, nuevaDirrecionAleatoria(), world, currentMovement, i + 1);
}


/**
 * @param {pacman}
 * @pacman {world}
 * @return {void}
*/

function moverPacmanSimplemente(pacman, world) {
    const cellSizeWidth = mapa.size.width / 26;
    const cellSizeHeight = cellSizeWidth;
    const pacmanSize = cellSizeWidth;
    let pacmanRow = Math.round10((pacman.y - pacmanSize / 2) / cellSizeHeight, -10); // fila con decimales, ejem: 1.12
    let pacmanCol = Math.round10((pacman.x - pacmanSize / 2) / cellSizeWidth, -10);//-10
    //console.log(pacmanStep)
    // console.log(pacman.x + cellSizeWidth)
    // console.log(pacman.nextMove)
    console.log(nextPosition(world, pacmanCol, pacmanRow, pacman.nextMove))
    //console.log(world.matrix[Math.round(pacmanRow)][Math.round(pacmanCol)] == 0 || world.matrix[Math.round(pacmanRow)][Math.round(pacmanCol)] == "p")
    if (pacman.nextMove == null) {

        return { x: pacman.x, y: pacman.y, currentMovement: pacman.currentMovement, nextMove: null };

        //return { x: pacman.x, y: pacman.y, currentMovement: pacman.currentMovement, nextMove: null };
    }
    if (pacman.nextMove == processing.RIGHT) {

        if (nextPosition(world, Math.round(pacmanCol), Math.round(pacmanRow), pacman.currentMovement) == 0 && nextPosition(world, Math.round(pacmanCol), Math.round(pacmanRow), pacman.nextMove) == 0)
            return { x: pacman.x + pacmanStep, y: pacman.y, currentMovement: processing.RIGHT, nextMove: null };
        else
            return { x: pacman.x, y: pacman.y, currentMovement: processing.RIGHT, nextMove: null };
    }
    if (pacman.nextMove == processing.LEFT) {

        if (nextPosition(world, Math.round(pacmanCol), Math.round(pacmanRow), pacman.currentMovement) == 0 && nextPosition(world, Math.round(pacmanCol), Math.round(pacmanRow), pacman.nextMove) == 0)
            return { x: pacman.x - pacmanStep, y: pacman.y, currentMovement: processing.LEFT, nextMove: null };
        else
            return { x: pacman.x, y: pacman.y, currentMovement: processing.LEFT, nextMove: null };
    }
    if (pacman.nextMove == processing.DOWN) {

        if (nextPosition(world, Math.round(pacmanCol), Math.round(pacmanRow), pacman.currentMovement) == 0 && nextPosition(world, Math.round(pacmanCol), Math.round(pacmanRow), pacman.nextMove) == 0)
            return { x: pacman.x, y: pacman.y + pacmanStep, currentMovement: processing.DOWN, nextMove: null };
        else
            return { x: pacman.x, y: pacman.y, currentMovement: processing.DOWN, nextMove: null };
    }
    if (pacman.nextMove == processing.UP) {

        if (nextPosition(world, Math.round(pacmanCol), Math.round(pacmanRow), pacman.currentMovement) == 0 && nextPosition(world, Math.round(pacmanCol), Math.round(pacmanRow), pacman.nextMove) == 0)
            return { x: pacman.x, y: pacman.y - pacmanStep, currentMovement: processing.UP, nextMove: null };
        else
            return { x: pacman.x, y: pacman.y, currentMovement: processing.UP, nextMove: null };
    }


}
/*if (pacman.currentMovement == null) { // Cuando esta al quieto
            processing.noStroke(); // no dibujar lineas de contorno
 
            if (pacman.nextMove == processing.UP)
                processing.rotate(radianes(270));
 
            if (pacman.nextMove == processing.DOWN)
                processing.rotate(radianes(90));
 
            if (pacman.nextMove == processing.LEFT)
                processing.rotate(radianes(180));
 
            if (pacman.nextMove == processing.RIGHT)
                processing.rotate(radianes(0));
 
            dibujarPacmanConArco(pacmanSize);//processing.arc(0, 0, pacmanSize, pacmanSize, radianes(45), radianes(315));
            processing.stroke(0); // volver a dibujar las lineas de contorno, color negro
            return;
        }*/