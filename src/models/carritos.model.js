import {Schema, model} from "mongoose";
import { productoSchema } from "./productos.model.js";

export const carritosSchema = Schema({
    productos: [ productoSchema ],
    date: { type: Date, default: Date.now }
});

export const carritosModel = model('carritos', carritosSchema);
