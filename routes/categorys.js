const router = require('express').Router();
const {
  agregarCategoria,
  obtenerCategorias,
  modificarCategoria,
  eliminarCategoria
} = require('../controllers/categorys')
var auth = require('./auth');

router.get('/', auth.opcional, obtenerCategorias)
router.get('/:id', auth.opcional, obtenerCategorias)// nuevo endpoint con todos los detalles de mascota
router.post('/', auth.requerido, agregarCategoria)
router.put('/:id', auth.requerido, modificarCategoria)
router.delete('/:id', auth.requerido, eliminarCategoria)

module.exports = router;