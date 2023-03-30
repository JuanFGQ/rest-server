const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers/generar-jwt");
const {ChatMensajes} = require('../models')

//*246
const chatMensajes = new ChatMensajes();

//*239-243-246
const socketController = async (socket =  new Socket(),io )=>{


    //para extraer el token del socket
const usuario = await comprobarJWT(socket.handshake.headers['x-token']);
    if(!usuario){
        return socket.disconnect();
    }
//agregar el usuario conectado,cuando se conecta un nuevo usuario //*246-249
chatMensajes.agregarUsuario(usuario);
io.emit('usuarios-activos',chatMensajes.usuariosArr);
socket.emit('recibir-mensajes',chatMensajes.ultimos10);



//enviar a una persona en especifico //*250
//conectar a una sala especial
socket.join(usuario.id);

        //limpiar cuando alguien se desconecta, para que quede guardada en lista de conectados
    socket.on('disconnect',()=>{
        chatMensajes.desconectarUsuario(usuario.id);
        io.emit('usuarios-activos',chatMensajes.usuariosArr);


    });
    //*248
    socket.on('enviar-mensaje',({uid,mensaje})=>{
//*250
if(uid){
    //mensaje privado
    socket.to(uid).emit('mensaje-privado',{de:usuario.nombre,mensaje})

}else{

        chatMensajes.enviarMensaje(usuario.id,usuario.nombre,mensaje);
//emitir a todos los usuarios
        io.emit('recibir-mensajes',chatMensajes.ultimos10);
}
    })
}

module.exports = {
    socketController
}