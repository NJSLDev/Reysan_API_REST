const mongoose = require('mongoose')
const Category = mongoose.model('Category')

// Funcion para crear nuevas categorias
function agregarCategoria(req, res, next) {
    var categoria = new Category(req.body)
    categoria.adminId = req.usuario.id
    categoria.save().then(categoria => {
        res.status(201).send(categoria)
    }).catch(next)
}

// Funcion para Obtener 1 o todas las categorias
function obtenerCategorias(req, res, next) {
    if (req.params.id) { // Obtener categoria por su id
        Category.findById(req.params.id)
            .populate('adminId', 'name status').then(categorias => {
                res.send(categorias)
            }).catch(next)
    } else {  // obtener todas las categorias existentes
        Category.find().then(categorias => {
            res.send(categorias)
        }).catch(next)
    }
}

// funcion para modificar una categoria
function modificarCategoria(req, res, next) {
    console.log("Categoria a modificar: " + req.params.id) //req.param.id - Categoria en uri

    Category.findById(req.params.id).then(categoria => { //Busca la categoria que se recibe como parámetro.

        if (!categoria) { return res.sendStatus(401); }   //Si no se encuentra categoria, retorna estaus 401.---

        let idUsuario = req.usuario.id;                   //User en JWT
        console.log("Usuario que modifica " + idUsuario);
        let idAdmin = categoria.adminId;                  //Administrador  que creo la categoria
        console.log(" Creador de categoria: " + idAdmin);
        if (idUsuario == idAdmin) {
            let nuevaInfo = req.body
            if (typeof nuevaInfo.name !== 'undefined')  //Nuevo nombre de la categoria
                categoria.name = nuevaInfo.name
            if (typeof nuevaInfo.status !== 'undefined') // Nuevo status de la categoria, solo puede ser "disponible" o "nodisponible"
                categoria.status = nuevaInfo.status
            categoria.save().then(updatedCategoria => {
                res.status(201).json(updatedCategoria.publicData())
            }).catch(next)
        }
        else {
            return res.sendStatus(401);
        }
    }).catch(next)
}

// Funcion para eliminar una categoria
function eliminarCategoria(req, res) {
    // únicamente borra a su propio categoria obteniendo el id del token
    Category.findById(req.params.id).then(categoria => {

        if (!categoria) { return res.sendStatus(401); }

        let idUsuario = req.usuario.id;
        console.log("Admin que modifica " + idUsuario);
        let idAdmin = categoria.adminId;
        console.log(" Admin creador de la categoria: " + idAdmin);

        if (idUsuario == idAdmin) { // Si el usuario que modifica es usuario admin
            let nombreCategoria = categoria.name;
            categoria.deleteOne();
            res.status(200).send(`Categoria ${req.params.id} eliminada. ${nombreCategoria}`);
        } else {
            return res.sendStatus(401);
        }
    });

}


module.exports = {
    agregarCategoria,
    modificarCategoria,
    eliminarCategoria,
    obtenerCategorias
}