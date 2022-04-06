const mongoose = require("mongoose");
const Usuario = mongoose.model('Usuario')
const Cite = mongoose.model('Cite')
const Category = mongoose.model('Category')
mongoose.set('useFindAndModify', false);

function crearCita(req, res, next) { // POST v1/citas?categoria_id=021abo59c96b90a02344...
    // Buscamos la categoria a solicitar
    Category.findById(req.query.categoria_id, async (err, categoria) => {
        if (!categoria || err) {
            return res.sendStatus(404)
        }
        if (categoria.status === 'nodisponible') {
            return res.sendStatus('El Servicio no esta disponible por el momento')
        }
        // si está dispobible podemos crear la cita
        const cita = new Cite(req.body)
        cita.service = req.query.categoria_id
        cita.citeDay = req.body.citeDay
        cita.userClient = req.usuario.id,
        cita.status = 'pendiente'
        cita.save().then(async s => {
            // antes de devolver respuesta actualizamos el tipo de usuario a anunciante
            await Usuario.findOneAndUpdate({ _id: req.usuario.id }, { tipo: 'solicitante' })
            res.status(201).send(s)
        }).catch(next)
    }).catch(next)
}

// Funcion para Obtener 1 o todas las citas
function obtenerCitas(req, res, next) {
    if (!req.params.id) {
        // sin :id, solo enlistaremos las citas dónde su status es pendiente o aceptada
        Cite.find({ $or: [{ status: "pendiente" }, { status: "aceptada" }] }).then(citas => {
            res.send(citas)
        }).catch(next)
    } else {
        // Al obtener una cita con el :id poblaremos los campos necesarios
        Cite.findOne({ _id: req.params.id, $or: [{ status: "pendiente" }, { status: "aceptada" }] })
            .then(async (cita) => {
                // añadimos información sobre la categoria
                await cita.populate('service','name status').execPopulate()
                if (cita.status === 'aceptada' || cita.status === 'pendiente') {
                    // Si la cita ha sido aceptada o esta pendiente se mostrará la información de contacto
                    await cita.populate('userClient', 'username fullName phone email').execPopulate()
                    res.send(cita)
                } else {
                    res.send(cita)
                }
            }).catch(next)
    }
}

// Funcion para modificar 1 cita
function modificarCita(req, res, next) {
    console.log("Cita a solicitar: " + req.params.id)

    Cite.findById(req.params.id).then(cita => {
        if (!cita) { return res.sendStatus(401); }

        console.log("Usuario solicita cambio cita: " + req.usuario.id);
        console.log("Usuario admin: " + cita.userClient);

        if (req.usuario.id == cita.userClient) {
            let nuevaInfo = req.body
            if (typeof nuevaInfo.service !== 'undefined')
                cita.service = nuevaInfo.service
            if (typeof nuevaInfo.citeDay !== 'undefined')
                cita.citeDay = nuevaInfo.citeDay
            if (typeof nuevaInfo.userClient !== 'undefined')
                cita.userClient = nuevaInfo.userClient
            if (typeof nuevaInfo.status !== 'undefined')
                cita.status = nuevaInfo.status
            cita.save().then(updateCita => {
                res.status(201).json(updateCita.publicData())
            }).catch(next)
        } else {
            return res.sendStatus(401);
        }
    }).catch(next)
}


module.exports = {
    crearCita,
    obtenerCitas,
    modificarCita,
    //eliminarCita,
}