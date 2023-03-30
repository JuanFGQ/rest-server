const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique:true
    },
    estado:{
        type:Boolean,
        default:true,
    },
    /*
    ES OTRO OBJETOC QUE MANTENEMOS EN MONGO 
    Y EL OBJECT ID APUNTA AL MODELO DEL USUARIO
    */
   //este es el usuario que esta creando el producto
    usuario:{
        type:Schema.Types.ObjectId,
        ref:'Usuario',
        required:true

    },
    precio:{
        type:Number,
        default:0
    },

    //aqui creo una referencia a las categorias. haciendo una llamada a la coleccion de categoria 
    categoria:{
        type:Schema.Types.ObjectId,
        ref:'Categoria',
        required:true
    },
    descripcion:{type:String},
    disponible:{type:Boolean,default:true},
    img:{type:String}

   
});

//esto funciona para excluir del resultado ciertos datos que no me interecen //179
ProductoSchema.methods.toJSON = function() {
    const {__v ,estado ,...data  } = this.toObject();
    
    return data;
}


module.exports = model( 'Producto', ProductoSchema );
