import {Schema, model} from "mongoose";

export const usuarioSchema = Schema({
    nombre: { type: String,  require: true },
    password: { type: String,  require: true },
    email: { type: String,  require: true },
    apellido :{ type: String,  require: true },
    direccion : { type: String,  require: true },
    edad :{ type: Number,  require: true },
    telefono :{ type: String,  require: true },
    avatar: { type: String, require: true }
});

export const usuarioModel = model('usuario', usuarioSchema);
