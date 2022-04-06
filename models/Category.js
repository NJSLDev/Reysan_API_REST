/*
Clase que representa la categoria del tipo de Servicio Ofrecido

Class Category {
        constructor(id, name, status, adminname) {
                this.id = id; //id de la categoria
                this.name = name; // nombre de la categoria
                this.status = status; // estado actual de la categoria
                this.adminname = adminname // admin que agrego la categoria
                }
        }

 module.exports = Category; */

const mongoose = require("mongoose");

// creando la clase o Schema de mongoose Category
const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    status: { type: String, enum: ['disponible', 'nodisponible'], required: true },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref:'Usuario'}
}, { collection:"categorys", timestamps: true })

// Valores publicos de las categorys
CategorySchema.methods.publicData = function () {
    return {
        id: this.id,
        name: this.name,
        status: this.status,
        adminId: this.adminid
    };
};

mongoose.model('Category', CategorySchema)
