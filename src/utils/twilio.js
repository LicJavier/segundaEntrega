import twilio from 'twilio'
import dotenv from 'dotenv';
dotenv.config();

const TWILIO_SID= process.env.TWILIO_SID;
const TWILIO_TOKEN= process.env.TWILIO_TOKEN;

const client = twilio( TWILIO_SID , TWILIO_TOKEN )

export default async function whatsappMsj( nombre, mail ) {
    client.messages 
    .create({ 
        body:  `Nuevo pedido de ${nombre}, ${mail} `, 
        from: 'whatsapp:+14155238886',       
        to: 'whatsapp:+5491130474577' 
    }) 
    .then(message => console.log(message.sid)) 
    .done();
}

