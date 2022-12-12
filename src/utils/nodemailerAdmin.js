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

export default async function cartAdminMessage( administrador , productos , nombre , correo ){
    try {
        await transporter.sendMail({
            from: `"Creaciones Natu" <no-reply@creacionesnatu.com>`, // sender address
            to: `${administrador}`, // list of receivers
            subject: `Nuevo Pedido de ${nombre}, ${correo}✔`, // Subject line
            text: "Nuevo pedido", // plain text body
            html: `<div>
                        <p>
                            ${productos}    
                        </p>
                    </div>`, // html body
        });
    } catch (error) {
        logger.error(error)
    }
}
