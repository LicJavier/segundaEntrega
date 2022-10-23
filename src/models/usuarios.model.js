import {Schema, model} from "mongoose";

export const usuarioSchema = Schema({
    nombre: { type: String,  require: true },
    password: { type: String,  require: true },
    email: { type: String,  require: true },
});

export const usuarioModel = model('usuario', usuarioSchema);
