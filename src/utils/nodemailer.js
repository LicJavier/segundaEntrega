import { createTransport } from "nodemailer";
import  dotenv  from "dotenv";
import logger from "../config/logger.config.js";

dotenv.config();

const transporter = createTransport({
    service: 'gmail',
    port: 587,
    auth:{
        user: process.env.ACCOUNT_MAIL,
        pass: process.env.PASS_MAIL,
    }
})

export default async function message( administrador , correo , nombre , apellido , direccion , edad , telefono ){
    try {
        await transporter.sendMail({
            from: `"Creaciones Natu" <no-reply@creacionesnatu.com>`, // sender address
            to: `${administrador} , ${correo} `, // list of receivers
            subject: "Nuevo Registro ✔", // Subject line
            text: "Cuenta creada con éxito", // plain text body
            html: `<div>
                        <h2>La cuenta se creó con éxito</h2>
                        <p>
                            <ul>
                                <li>Nombre: ${nombre} ${apellido} </li>
                                <li>dirección: ${direccion}</li>
                                <li>edad: ${edad}</li>
                                <li>teléfono: ${telefono}</li>
                                <li>correo: ${correo}</li>
                            </ul>
                        </p>
                    </div>`, // html body
        });
    } catch (error) {
        logger.error(error)
    }
}

