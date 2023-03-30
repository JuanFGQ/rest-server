const { response, request } = require("express");
const { Categoria } = require("../models");





//este es para obtener una general de todas las categorias-publico //*179
const obtenerCategorias = async(req = request,res = response)=>{

    const { limite = 5, desde = 0 } = req.query;

    const query = {estado:true}

const [total, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    Categoria.find(query)
    //hagp referencial al usuario y luego al dato que quiero conocer que es el nombre //*179
    .populate('usuario','nombre')
        .skip( Number( desde ) )
        .limit(Number( limite ))
    // .findOne({nombre})


]);

res.json({
    total,
    categorias
});



}

//este es para tener las categorias por un id especifico-privado //*179
const obtenerCategoria = async(req,res = response) => {
    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate('usuario',' nombre');

    res.json(categoria);
}

const crearCategoria = async(req,res = response) => {

    //le pido al body de postman que me de el nombre 
    const nombre = req.body.nombre.toUpperCase();
    //dentro del modelo de las categorias busco si ya hay un nombre igual 
    const categoriaDB = await Categoria.findOne({nombre});

    if(categoriaDB){
        return res.status(400).json({
            msg:`La categoria ${categoriaDB.nombre},ya existe`
        });
    }
// generar la data que se va a guardar en la base de datos 
    const data = {
        nombre,
        //pedimos el id desde el usuario de mongo 
        usuario:req.usuario._id
    }
    //aqui preparo la data a enviar como una nueva instacia de categoria 
    const categoria =  new Categoria(data);
    //guardar DB
   await  categoria.save();

   res.status(201).json(categoria);

}


//*179
const actualizarCategoria = async(req,res= response)=>{
    //extrayendo id //*179
    const {id} = req.params;
    console.log(id);
    const {estado,usuario, ...data} = req.body;

    //nombre del producto capitalizado //*179
data.nombre = data.nombre.toUpperCase();
//id del usuario dueño del token que esta actualizando  //*179
data.usuario = req.usuario._id;

//el new en true hace que se vea la informacion actualizada en la respuesta
const categoria = await Categoria.findByIdAndUpdate(id,data,{new:true});
console.log(categoria);

res.json (categoria);

}


const borrarCategoria = async (req,res = response) => {
    const {id} = req.params;
    const categoria = await Categoria.findByIdAndUpdate(id,{estado: false});

    res.json(categoria)
}



module.exports = {
    crearCategoria,
   obtenerCategorias,
    actualizarCategoria,
    obtenerCategoria,
    borrarCategoria
}