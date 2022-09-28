import {Schema, model} from "mongoose";

export const productoSchema = Schema({
    nombre: { type: String,  require: true },
    categoria: { type: String,  require: true },
    stock: { type: Number, require: true },
    precio: { type: Number, require: true },
    img: { type: String, require: true }
});

export const productoModel = model('productos', productoSchema);
