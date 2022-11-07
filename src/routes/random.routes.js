import express from 'express'
import { fork } from 'child_process';
const child = fork('./src/utils/child.js')
const routerRandoms = express.Router();

routerRandoms.get('/:cant', async ( req , res )=>{
    let numeros = parseInt(req.params.cant);
    if(isNaN(numeros)){
        numeros = 100000000;
    }
    child.send( numeros );
    child.on('message', data => console.log(data));
    try {
        res.render('randoms')
    } catch (error) {
        console.log(error)
    }
});


export default routerRandoms;
child.on('error', (err) => {
console.log(err)

});
