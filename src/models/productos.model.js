import {Schema, model} from "mongoose";

export const productoSchema = Schema({
    name: { type: String,  require: true },
    categoria: { type: String,  require: true },
    stock: { type: Number, require: true },
    price: { type: Number, require: true },
    img: { type: String, require: true },
    id2: { type: String, require: true }
});

export const productoModel = model('productos', productoSchema);
