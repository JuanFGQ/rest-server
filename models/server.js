const express = require('express');
const cors = require('cors');
const fileUpload =  require('express-fileupload');

const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/socket_controller');

class Server {

    constructor() {
        this.app  = express();
        this.port = process.env.PORT;
        this.server = require('http').createServer(this.app);//*239
        this.io = require('socket.io')(this.server);


        //esto es para ordenar los enlaces //*175
        this.paths = {
            auth:'/api/auth',
            usuarios:'/api/usuarios',
            categrias:'/api/categorias',
            productos:'/api/productos',
            buscar:'/api/buscar',
            uploads:'/api/uploads'
        }
        // this.usuariosPath = '/api/usuarios';
        // this.authPath     = '/api/auth';

        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();

        //para escuchar sockets

        this.sockets();
    }

    async conectarDB() {
        await dbConnection();
    }


    middlewares() {

        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio Público
        this.app.use( express.static('public') );

        //file upload o carga de archivos //*193
        // Note that this option available for versions 1.0.0 and newer. 
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath:true
})
);

    }

    routes() {
        
        this.app.use( this.paths.auth, require('../routes/auth'));
        this.app.use( this.paths.usuarios, require('../routes/usuarios'));
        this.app.use( this.paths.categrias, require('../routes/categorias'));
        this.app.use( this.paths.productos, require('../routes/productos'));
        this.app.use( this.paths.buscar, require('../routes/buscar'));
        this.app.use( this.paths.uploads, require('../routes/uploads'));



    }
//*239
    sockets(){
      //*246
        this.io.on('connection',(socket) => socketController(socket,this.io));

    }

    listen() {
        this.server.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }

}




module.exports = Server;
