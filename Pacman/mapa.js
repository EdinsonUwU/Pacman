// dibujarMapa
// inicializarPacman
// inicializarFantasma

/**
 * Dibuja el mapa segun el tipo de la celda
 * @param {object} world
 * @param {object} processing
 * @return {void}
 **/
function dibujarMapa(world, processing) {
    processing.background(20, 35, 80);
    processing.background(3, 4, 5);
    forEach(world.matrix, (row, i) => {
        forEach(row, (cell, j) => {

            if (cell == mapa.camino) { // si se encuentra con un camino (2) dibuja una imagen

                //processing.image(pasillo, j * cellSize, i * cellSize, 40, 40);
            }

            if (cell == mapa.pared) { // si se encuentra con una pared (1) dibuja una imagen
                processing.fill(10, 30, 220);

                // muros 3 : caso vertical
                let misVecinos = vecinos(world.matrix, i, j);
                if (i == 0 && j == 0) {
                    console.log(1);
                }

                if (misVecinos[0] && misVecinos[1] && !misVecinos[2] && !misVecinos[3]) { // vertical
                    processing.translate(j * cellSize + cellSize, i * cellSize);
                    processing.rotate(radianes(90));
                    processing.image(Muros3, 0, 0, cellSize, cellSize);
                }

                else if (!misVecinos[0] && !misVecinos[1] && misVecinos[2] && misVecinos[3]) { // horizontal
                    processing.image(Muros3, j * cellSize, i * cellSize, cellSize, cellSize);
                }

                else if (misVecinos[0] && !misVecinos[1] && !misVecinos[2] && misVecinos[3]) // esquina arriba derecha
                    processing.image(Muros2, j * cellSize, i * cellSize, cellSize, cellSize);

                else if (misVecinos[0] && !misVecinos[1] && misVecinos[2] && !misVecinos[3]) { // esquina arriba izquierda
                    processing.translate(j * cellSize, i * cellSize);
                    processing.rotate(radianes(270));
                    processing.image(Muros2, -cellSize, 0, cellSize, cellSize);
                }

                else if (!misVecinos[0] && misVecinos[1] && !misVecinos[2] && misVecinos[3]) { // esquina abajo derecha
                    processing.translate(j * cellSize, i * cellSize);
                    processing.rotate(radianes(90));
                    processing.image(Muros2, 0, - cellSize, cellSize, cellSize);
                }

                else if (!misVecinos[0] && misVecinos[1] && misVecinos[2] && !misVecinos[3]) { // esquina abajo izquierda
                    processing.translate(j * cellSize, i * cellSize);
                    processing.rotate(radianes(180));
                    processing.image(Muros2, - cellSize, - cellSize, cellSize, cellSize);
                }

                else if (!misVecinos[0] && !misVecinos[1] && !misVecinos[2] && misVecinos[3]) { // fin derecha
                    processing.translate(j * cellSize, i * cellSize);
                    processing.rotate(radianes(0));
                    processing.image(Muros7, 0, 0, cellSize, cellSize);
                }

                else if (!misVecinos[0] && !misVecinos[1] && misVecinos[2] && !misVecinos[3]) { // fin izquierda
                    processing.translate(j * cellSize, i * cellSize);
                    processing.rotate(radianes(180));
                    processing.image(Muros7, -cellSize, -cellSize, cellSize, cellSize);
                }

                else if (misVecinos[0] && !misVecinos[1] && !misVecinos[2] && !misVecinos[3]) { // fin inferior
                    processing.translate(j * cellSize, i * cellSize);
                    processing.rotate(radianes(270));
                    processing.image(Muros7, -cellSize, 0, cellSize, cellSize);
                }

                else if (!misVecinos[0] && misVecinos[1] && !misVecinos[2] && !misVecinos[3]) { // fin superior
                    processing.translate(j * cellSize, i * cellSize);
                    processing.rotate(radianes(90));
                    processing.image(Muros7, 0, -cellSize, cellSize, cellSize);
                }

                else if (misVecinos[0] && !misVecinos[1] && misVecinos[2] && misVecinos[3]) { // cruce hacia arriba
                    processing.translate(j * cellSize, i * cellSize);
                    processing.rotate(radianes(0));
                    processing.image(Muros9, 0, 0, cellSize, cellSize);
                }

                else if (!misVecinos[0] && misVecinos[1] && misVecinos[2] && misVecinos[3]) { // cruce hacia abajo
                    processing.translate(j * cellSize, i * cellSize);
                    processing.rotate(radianes(180));
                    processing.image(Muros9, -cellSize, -cellSize, cellSize, cellSize);
                }

                else if (misVecinos[0] && misVecinos[1] && !misVecinos[2] && misVecinos[3]) { // cruce hacia derecha
                    processing.translate(j * cellSize, i * cellSize);
                    processing.rotate(radianes(90));
                    processing.image(Muros9, 0, -cellSize, cellSize, cellSize);
                }

                else if (misVecinos[0] && misVecinos[1] && misVecinos[2] && !misVecinos[3]) { // cruce hacia izquierda
                    processing.translate(j * cellSize, i * cellSize);
                    processing.rotate(radianes(270));
                    processing.image(Muros9, -cellSize, 0, cellSize, cellSize);
                }

                else
                    processing.rect(j * cellSize, i * cellSize, cellSize, cellSize);
                processing.resetMatrix();
            }


            if (cell == mapa.galleta) { // si se encuentra con una galleta (0) dibuja una imagen
                if (world.time % 80 <= 40) {
                    processing.image(coinImage,
                        j * cellSize + cellSize / 2 - 5.5,
                        i * cellSize + cellSize / 2 - 5.5,
                        11, 11);
                }
                if (world.time % 80 > 40) {
                    processing.image(coinImage,
                        j * cellSize + cellSize / 2 - 6,
                        i * cellSize + cellSize / 2 - 6,
                        12, 12);
                }
            }

            if (cell == mapa.galletaG) { // si se encuentra con una galletaG (3) dibuja una imagen
                if (world.time % 80 <= 40) {
                    processing.image(coinImage,
                        j * cellSize + cellSize / 2 - 11,
                        i * cellSize + cellSize / 2 - 11,
                        20, 20);
                }
                if (world.time % 80 > 40) {
                    processing.image(coinImage1,
                        j * cellSize + cellSize / 2 - 13,
                        i * cellSize + cellSize / 2 + -13,
                        23, 23);
                }
            }

            if (cell == mapa.fruta && (world.time % (framesPerSecond * 20)) > framesPerSecond * 16) // si se encuentra con una fruta (F) se dibuja una 
                processing.image(cerezaImage, j * cellSize, i * cellSize, cellSize, cellSize); // imagen en un intervalo de tiempo

        });
    });
}

function vecinos(matrix, i, j) {
    var vecino1 = false; var vecino2 = false; var vecino3 = false; var vecino4 = false; var vecino5 = false; var vecino6 = false; var vecino7 = false; var vecino8 = false;

    if (matrix[i - 1])
        var vecino1 = matrix[i - 1][j] == mapa.pared; // el de arriba

    if (matrix[i + 1])
        var vecino2 = matrix[i + 1][j] == mapa.pared; // el de abajo

    if (matrix[i][j - 1])
        var vecino3 = matrix[i][j - 1] == mapa.pared; // el de la izquierda

    if (matrix[i][j + 1])
        var vecino4 = matrix[i][j + 1] == mapa.pared; // el de la derecha

    if (matrix[i - 1])
        var vecino5 = matrix[i - 1][j - 1] == mapa.pared; // el de arriba izquierda

    if (matrix[i + 1])
        var vecino6 = matrix[i + 1][j - 1] == mapa.pared; // el de abajo izquierda

    if (matrix[i - 1])
        var vecino7 = matrix[i - 1][j + 1] == mapa.pared; // el de arriba derecha

    if (matrix[i + 1])
        var vecino8 = matrix[i + 1][j + 1] == mapa.pared; // el de abajo derecha

    return [vecino1, vecino2, vecino3, vecino4, vecino5, vecino6, vecino7, vecino8];
}


/**
 * Posiciona el pacman donde haya una "p" en la matriz
 * @param {world}
 * @return {pacman}
*/
function inicializarPacman(world) {
    return forEachWithReturn(world.matrix, (row, i) => {
        return forEachWithReturn(row, (cell, j) => {
            if (cell == mapa.pacman)
                return Object.assign(world.pacman,
                    { x: j * cellSize + cellSize / 2 },
                    { y: i * cellSize + cellSize / 2 }
                );
        });
    });
}


/**
 * Posiciona el fantasma donde haya una "R" en la matriz
 * @param {world}
 * @return {fantasma}
*/
function inicializarFantasma(world, fantasma, letra) {
    return forEachWithReturn(world.matrix, (row, i) => {
        return forEachWithReturn(row, (cell, j) => {
            if (cell == letra)
                return Object.assign(fantasma,
                    { x: j * cellSize },
                    { y: i * cellSize },
                    { estado: EPacman.Alive }
                );
        });
    });
}


// ----------------------------------------------------------------------------------------------------------------
// FUNCIONES AUXILIARES
// ----------------------------------------------------------------------------------------------------------------


/**
 * 
 * @param {lista} l 
 * @param {funcion} f 
 * @param {integer} index 
 */
function forEach(l, f, index = 0) {
    if (!isEmpty(l)) {
        f(first(l), index);
        forEach(rest(l), f, index + 1);
    }
}


/**
 * 
 * @param {lista} l 
 * @param {function} f 
 * @param {integer} index 
 */
function forEachWithReturn(l, f, index = 0) {
    if (!isEmpty(l)) {
        let r = f(first(l), index);
        if (r) return r;
        return forEachWithReturn(rest(l), f, index + 1);
    }
}