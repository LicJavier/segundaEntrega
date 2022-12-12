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

export default async function cartUserMessage( correo ){
    try {
        await transporter.sendMail({
            from: `"Creaciones Natu" <no-reply@creacionesnatu.com>`, // sender address
            to: `${correo}`, // list of receivers
            subject: "Nuevo Pedido ✔", // Subject line
            text: "Su pedido ha sido recibido y se encuentra en Proceso", // plain text body
            html: `<div>
                        <h2>Su pedido ha sido recibido y se encuentra en Proceso</h2>
                        <p>¡Gracias por elegirnos!</p>
                    </div>`, // html body
        });
    } catch (error) {
        logger.error(error)
    }
}

