class Mensaje {
    constructor (uid,nombre,mensaje){
        this.uid = uid;
        this.nombre = nombre;
        this.mensaje = mensaje

    }
}

//*245
class ChatMensajes {
    constructor ( ){
        this.mensajes = [];
        this.usuarios = {};
    }

    //para recibir los ultimos 10 mensajes
    get ultimos10(){
        this.mensajes = this.mensajes.splice(0,10);
        return this.mensajes;
    }
    get usuariosArr ( ){
        return Object.values(this.usuarios);
        }

        enviarMensaje(uid,nombre,mensaje){
            this.mensajes.unshift(
                new Mensaje(uid,nombre,mensaje)
            );

        }
        agregarUsuario (usuario){
            this.usuarios[usuario.id] = usuario
        }
        desconectarUsuario (id){
            delete this.usuarios[id];
        }

}

module.exports = ChatMensajes;