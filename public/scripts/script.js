//----------------------------------------------------------------------------------------------
//------------------------------MANEJO DE SOCKET------------------------------------------------
//----------------------------------------------------------------------------------------------

socket.on('from server msj', mensajes => render( mensajes ));
socket.on('los mensajes', mensajes => render(mensajes));
const authorSchema = new normalizr.schema.Entity( 'author' , {} , {idAttribute: 'id' });
const textoSchema = new normalizr.schema.Entity('texto' , { author: authorSchema } , { idAttribute: 'id' } );
const postSchema = new normalizr.schema.Entity('posts', { post: [textoSchema] } , { idAttribute: 'id' } )

const historial = document.querySelector('#historial');
function render(mensajes) {
    const mensajesDesnormalizados = normalizr.denormalize( mensajes.result , postSchema , mensajes.entities )
    const tamanioMensaje = JSON.stringify(mensajes).length;
    const tamanioDesnormalizado = JSON.stringify(mensajesDesnormalizados).length;
    const mensajeComprimido = parseInt((tamanioDesnormalizado*100)/ tamanioMensaje);
    console.log(mensajesDesnormalizados)
    document.querySelector('#compresion').innerHTML = `Compresión de los mensajes ${mensajeComprimido} %`;
    const cuerpoMensajes = mensajesDesnormalizados.msj.map((msj)=>{
        return `<div class="flex"><span class=" w-14 h-14"><img class"w-12 h-12" src='${msj.nombre.author.avatar}'></span><span><b class="text-blue-600 font-bold">${msj.nombre.author.id}: </b><span class="text-amber-800">${msj.nombre.hora} </span><span class="italic text-green-700">${msj.nombre.text}</span></span></div>`
    }).join('</br>');
    historial.innerHTML = cuerpoMensajes;    
}

const enviar = document.querySelector("#enviar");
enviar.addEventListener('click', enviarMensaje);
const formMensaje = document.querySelector('.formMensaje')
function enviarMensaje(event) {
    event.preventDefault();
    const inputUser = document.querySelector('#user');
    const inputNombre = document.querySelector('#nombre');
    const inputApellido = document.querySelector('#apellido');
    const inputApodo = document.querySelector('#apodo');
    const inputEdad = document.querySelector('#edad');
    const inputContenido = document.querySelector('#contenidoMensaje');
    const inputAvatar = document.querySelector('#avatar')

    const mensaje = 
        { author: {
            id: inputUser.value,
            nombre: inputNombre.value,
            apellido: inputApellido.value,
            apodo: inputApodo.value,
            edad: inputEdad.value,
            avatar: inputAvatar.value
            },
        text: inputContenido.value
    }
    socket.emit('from-cliente-msj', mensaje)
    formMensaje.reset();
}
