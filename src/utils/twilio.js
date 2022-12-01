import twilio from 'twilio'
import dotenv from 'dotenv';
dotenv.config();

const TWILIO_SID= process.env.TWILIO_SID;
const TWILIO_TOKEN= process.env.TWILIO_TOKEN;

const client = twilio( TWILIO_SID , TWILIO_TOKEN )

client.messages 
    .create({ 
        body: 'Mensaje de Javier desde twilio con nodeJs', 
        from: 'whatsapp:+14155238886',       
        to: 'whatsapp:+541130474577' 
    }) 
    .then(message => console.log(message.sid)) 
    .done();