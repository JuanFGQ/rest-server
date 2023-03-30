
//*242

let usuario = null;
let socket = null;



// referencias de html //*244
const txtUid         = document.querySelector('#txtUid');
const txtMensaje     = document.querySelector('#txtMensaje');
const ulUsuarios     = document.querySelector('#ulUsuarios');
const ulMensajes     = document.querySelector('#ulMensajes');
const btnSalir       = document.querySelector('#btnSalir');

//validar el toke del local storage en la web
const validarJWT = async () => {

    //local storage es un campo donde se guarda el token en el navegador 
    //al escribir la palabra 'token' , si no viene seria un string vacio
    const token = localStorage.getItem('token') || '';

    //si el token tiene menos de 10 letras 
    if(token.length <= 10){
        //redirije a la ventana html del index
        window.location = 'index.html'
        //nos lanza este error
        throw new Error('No hay token en la peticion');
    }
    const resp = await fetch ('http://localhost:3000/api/auth/',{
        headers:{'x-token': token }
    });

    const {usuario:userDB,token:tokenDB} = await resp.json();
   
    //metodo para establecer el nuevo token en el local storage cuando se refresca la pagina
    localStorage.setItem('token',tokenDB);
    //para saber informacion del usuario
    usuario = userDB;

    //para poner en el cabecero de la pestaña el nombre de quien esta conectado
    document.title = usuario.nombre;

    await conectarSocket();
    

}

//*243
const conectarSocket =  async ()=>{
socket = io({
    'extraHeaders':{
        'x-token':localStorage.getItem('token')

    }
});

//se crean los eventos cuando el socket se dispare //*244
socket.on('connect', () =>{
    console.log('Sockets online')
    
});
socket.on('disconnect', () =>{
    console.log('Sockets offline')
    
});
//*249
socket.on('recibir-mensajes',dibujarMensajes);
//*247
socket.on('usuarios-activos', dibujarUsuarios);
socket.on('mensaje-privado', (payload)=>{
    console.log('Privado',payload);
    

});


    
}
//*247
const dibujarUsuarios = (usuarios= []) => {
let usersHtml = '';
usuarios.forEach(({nombre,uid}) =>{
    usersHtml += `
    <lis>
        <p>
            <h5 class="text-success">${nombre}</h5>
            <span class="fs-6 text-muted">${uid}</span>
        </p>
    </lis>
    
    `

});
ulUsuarios.innerHTML = usersHtml;
}

//*249
const dibujarMensajes = (mensajes = []) => {
    let mensajesHTML = '';
    mensajes.forEach(({nombre,mensaje}) =>{
        mensajesHTML += `
        <lis>
            <p>
                <span class="text-primary">${nombre}:</span>
                <span>${mensaje}</span>
            </p>
        </lis>
        
        `
    
    });
    ulMensajes.innerHTML = mensajesHTML;
    }



//*248
txtMensaje.addEventListener('keyup',({keycode})=>{


    const mensaje = txtMensaje.value;
    const uid = txtUid.value;

// if(keycode !== 13 ){return;}
// if(mensaje.length === 0 ){return;}

socket.emit('enviar-mensaje',{mensaje,uid});

// txtMensaje.value = '';

    
});


const main =async( )=>{

    await validarJWT();

}


main();
