function mostrarNumeros(params) {
    const parrafo = document.querySelector('.random');
    parrafo.innerHTML = params;
}

socket.on('enviando-resultado', numeros => mostrarNumeros(numeros));
