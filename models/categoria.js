const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
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
    usuario:{
        type:Schema.Types.ObjectId,
        ref:'Usuario',
        required:true

    },
   
});

//esto funciona para excluir del resultado ciertos datos que no me interecen //179
CategoriaSchema.methods.toJSON = function() {
    const {__v ,estado ,...data  } = this.toObject();
    
    return data;
}


module.exports = model( 'Categoria', CategoriaSchema );
