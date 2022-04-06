// Cite.js
/*
// Clase que representa una cita
Class Cite {
        constructor(id,userClient,day,service,status){
        this.id = id;
        this.userClient = userClient;
        this.day = day;
        this.status = status;
        }
}

module.exports = Cite;
*/

const mongoose = require("mongoose");

// creando la clase o Schema de mongoose Cite
const CiteSchema = new mongoose.Schema({
    userClient: { type: mongoose.Schema.Types.ObjectId, ref:"Usuario"},
    citeDay: { type: Date, required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    status: { type: String, enum: ['aceptada', 'noaceptada', 'pendiente','done'] }
}, { collection: "citas", timestamps: true });

// Valores publicos de las Cites
CiteSchema.methods.publicData = function () {
    return {
        id: this.id,
        userClient: this.userClient,
        citeDay: this.citeDay,
        service: this.service,
        status: this.status
    };
};

mongoose.model('Cite', CiteSchema);
