const { response } = require("express");
const { Categoria } = require("../models");




//obtener categorias- hay que paginarlo, ver total , cuantas categorias tiene - 
//investigar populate de mongoose

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

module.exports = {
    crearCategoria
}