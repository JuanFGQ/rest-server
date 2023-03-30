const { response } = require("express");
const {ObjectId} = require('mongoose').Types;
const {Usuario,Categoria,Producto} = require('../models')

const coleccionesPermitidas = [
    //todas las colecciones validas que yo he creado //*184
    'usuarios',
    'categoria',
    'productos',
    'roles'

];

const buscarUsuarios = async (termino = '', res = response)=>{
   
    //verifica que si es un id de mongo me retorna un true de lo contrario false //*184
   const esMongoID = ObjectId.isValid(termino) ; 

   if(esMongoID){
    const usuario =  await Usuario.findById(termino);
   return res.json({
    //si hay resultados los manda en el arreglo, si no hay manda el arreglo vacio
        results: (usuario)?[usuario]:[]
    });
   }

   //esta funcion atrapa el termino que fue lo que yo quice buscar en postam
   //y la i minuscula lo hace insensible a las mayusculas o minusculas con las que 
   //haya escrito mi busqueda 
   //y tambien me trae todos los resultados que contengan el termino que busquè
   const regex = new RegExp(termino,'i'); //*185

   //el nombre de los usuarios es igual al termino , el termino sale de lo que 
//    le pedimos o escribimos  en el buscador  de postaman al final de la url
const usuarios = await Usuario.find({
    //lo puedo buscar por el correo o el nombre
    $or:[{nombre:regex},{correo:regex}],
    //y ademas tienen que estar activos
    $and:[{estado : true}]
});

res.json({
    results:usuarios
})


}


const buscarCategorias = async(termino = '',res = response)=>{
    const esMongoID= ObjectId.isValid(termino);

    if(esMongoID){
        const categoria= await Categoria.findById(termino)
        return res.json({
            results:(categoria)?[categoria]:[]
        });
    }
    const regex = new RegExp(termino,'i');

    const categorias = await Categoria.find({nombre:regex});
    res.json({
        results:categorias
    })
}

const buscarProductos = async(termino = '',res = response)=>{
    const esMongoID= ObjectId.isValid(termino);

    if(esMongoID){
        const producto= await Producto.findById(termino)
                                      .populate('categoria','nombre');
        return res.json({
            results:(producto)?[producto]:[]
        });
    }
    const regex = new RegExp(termino,'i');

    const productos = await Producto.find({nombre:regex,estado:true}) 
                                    .populate('categoria','nombre');

    res.json({
        results:productos
    })
}


const buscar = (req,res =response)=> {


const {coleccion,termino} = req.params;


if(!coleccionesPermitidas.includes(coleccion)){
    return res.status(400).json({
        msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
    })
}

switch (coleccion) {
        case  'usuarios':
            buscarUsuarios(termino,res)
        break;

        case 'categoria':
            buscarCategorias(termino,res)
        break;
        
        case  'productos':
            buscarProductos(termino,res)
        break;

    default:
        res.status(500).json({
            msg:'Se le olvido hacer la busqueda  '
        })
}
 
}

module.exports = {
    buscar
}