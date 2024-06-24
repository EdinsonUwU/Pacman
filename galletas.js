// comerGalleta
// comerFruta
// contarGalletas

/**
 * Si la posicion en la que se encuentra el pacman en la matriz es igual a pacman.galleta (0), cambia el valor 
 * por pacman.camino (2), cuando se ejecuta la funcion se aumenta en 1 el puntaje.
 * @param {world} world
 * @param {integer} poss
 * @return {world}
 */
function comerGalleta(world, pos) {
    return Object.assign(world,
        { matrix: deepCopy(world.matrix, pos, mapa.camino) },
        { puntaje: world.puntaje + 1 },
        { numeroDeGalletas: world.numeroDeGalletas - 1 }
    );
}


/**
 * Si la posicion en la que se encuentra el pacman en la matriz es igual a pacman.fruta (F), 
 * cambia el valor por pacman.camino (2), cuando se ejecuta la funcion se aumenta en 100 el puntaje.
 * @param {world} world 
 * @param {integer} pos 
 * @return {world}
 */
function comerFruta(world, pos) {
    if ((world.time % (framesPerSecond * 20)) > framesPerSecond * 16)
        return Object.assign(world, { matrix: deepCopy(world.matrix, pos, mapa.camino) }, { puntaje: world.puntaje + 100 });
    else
        return false;
}

/**
 * Recorre la matriz y cuenta la cantidad de galletas (0), que hay.
 * @param {*} mapa 
 * @param {*} i
 * @return {integer} 
 */
function contarGalletas(matrix) {
    return numeroDeIncidencias(matrix, mapa.galleta) + numeroDeIncidencias(matrix, mapa.galletaG);
}



// ----------------------------------------------------------------------------------------------------------------
// FUNCIONES AUXILIARES
// ----------------------------------------------------------------------------------------------------------------


/**
 * Realiza una copia profunda de la matriz, sirve para una lista de listas
 * @param {lista} lista 
 * @param {object} pos
 * @param {number}
 * @return {matrix} val 
 * @param {void}
 */
function deepCopy(lista, pos, val) {
    if (length(lista) == 0) {
        return [];
    }
    if (isList(first(lista))) { // el elemento es una lista
        if (pos.fil == 0) {
            var listaActual = cambiaxn(first(lista), val, pos.col);
        } else {
            var listaActual = first(lista);
        }
        return cons(deepCopy(listaActual, pos, val), deepCopy(rest(lista), { fil: pos.fil - 1, col: pos.col }, val));
    } else { // el primer elemento no es una lista isList(first([1,2]))
        return cons(first(lista), deepCopy(rest(lista), pos, val));
    }
}


/** 
 * decirme si puedo reemplazar un numero x en la posicion n de una lista
 * @param {lista}
 * @param {number}
 * @param {number}
 * @return {bool}
 */
function estaDentro(lista, x, n) {
    if (length(lista) > n && n >= 0) {
        return true;
    }
    else {
        return false;
    }
}


/**.
 * cambia  un valor por x en la posicion n de una lista
 * @param {lista}
 * @param {number}
 * @param {number}
 * @return {lista}
 */
function cambiaxn(lista, x, n) {
    if (estaDentro(lista, x, n) == true && n == 0) {
        return cons(x, rest(lista))
    }
    else if (estaDentro(lista, x, n)) {
        return cons(first(lista), cambiaxn(rest(lista), x, n - 1));
    }
    else {
        return lista;
    }
}

/**
 * Vuelve una lista bidimensional [[0],[0]] una lista unidimensional [0,0]
 * @param {lista} lista 
 * @return {lista}
 */
function volverLista(lista) {
    if (length(lista) == 1)
        return first(lista)
    else
        return append(first(lista), volverLista(rest(lista)))
}
/**
 * Crea una lista con todos los valores que hayan iguales al parametro val en la lista
 * @param {lista} lista 
 * @param {number} val 
 * @return {lista}
 */
function numeroDeIncidencias(lista, val) {
    let listaUnidimensional = volverLista(lista);
    let listaFiltrada = filter(listaUnidimensional, (a) => a == val);
    return length(listaFiltrada);
}
/**
 * filtra elementos de una lista deacuerdo con una funcion
 * @param {lista} uldn 
 * @param {funcion} f 
 * @return {lista}
 */
function filter(uldn, f) {
    if (isEmpty(uldn)) {
        return [];
    }
    else {
        const restar = filter(rest(uldn), f);
        if (f(first(uldn))) {
            return cons(first(uldn), restar)
        }
        else {
            return restar
        }
    }
}