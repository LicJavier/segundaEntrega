//----------------------------------------------------------------------------------------------
//------------------------------MANEJO DE SOCKET------------------------------------------------
//----------------------------------------------------------------------------------------------
const socket = io();

socket.on('from server msj', mensajes => render( mensajes ));
socket.on('update-mensaje', ()=> location.reload())

const authorSchema = new normalizr.schema.Entity( 'author' , {} , {idAttribute: 'id' });
const textoSchema = new normalizr.schema.Entity('texto' , { author: authorSchema } , { idAttribute: 'id' } );
const postSchema = new normalizr.schema.Entity('posts', { post: [textoSchema] } , { idAttribute: 'id' } )

function render(mensajes) {
    const mensajesDesnormalizados = normalizr.denormalize( mensajes.result , postSchema , mensajes.entities )
    const tamanioMensaje = JSON.stringify(mensajes).length;
    console.log(tamanioMensaje);
    const tamanioDesnormalizado = JSON.stringify(mensajesDesnormalizados).length;
    console.log(tamanioDesnormalizado)
    const mensajeComprimido = parseInt((tamanioMensaje*100)/ tamanioDesnormalizado);
    const cuerpoMensajes = mensajesDesnormalizados.map((msj)=>{
        return `<span><b class="text-blue-600 font-bold" >${msj.author.id}: </b><span class="text-amber-800">${msj.hora} </span><span class="italic text-green-700">${msj.text}</span></span><span>${msj.author.nombre.avatar} </span>`
    }).join('<br>');
    document.querySelector('.compresion').innerHTML = `Compresión de mensajes ${mensajeComprimido}%`;
    document.querySelector('#historial').innerHTML = cuerpoMensajes;
    
}
const enviar = document.querySelector("#enviar");
enviar.addEventListener('click', enviarMensaje);
const formMensaje = document.querySelector('.formMensaje')
function enviarMensaje(event) {
    // event.preventDefault();
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
    // formMensaje.reset();
    socket.emit('from-cliente-msj', mensaje)
}
