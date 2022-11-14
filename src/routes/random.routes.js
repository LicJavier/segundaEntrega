import express from 'express'
import { fork } from 'child_process';
import logger from "../utils/logger.config.js";
// const child = fork('./src/utils/child.js')
const routerRandoms = express.Router();

routerRandoms.get('/:cant', async ( req , res )=>{
    let numeros = parseInt(req.params.cant);
    if(isNaN(numeros)){
        numeros = 100000000;
    }
    // child.send( numeros );
    // child.on('message', data => console.log(data));
    try {
        res.render('randoms')
    } catch (error) {
        logger.error(error)
    }
});


export default routerRandoms;
// child.on('error', (err) => {
// console.log(err)

// });
