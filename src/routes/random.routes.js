import express from 'express'
import { fork } from 'child_process';
const child = fork('./server.js')
const routerRandoms = express.Router();
let objetoNumero = [];

async function random(min, max) {
    let resultado = Math.floor((Math.random() * (max - min + 1)) + min);
    return resultado
}

async function calcularNumeros(params) {
    for (let index = 0; index < params; index++) {
        objetoNumero.push(await random( 1 , 1000 ))
    }
}

routerRandoms.get('/:cant', async ( req , res )=>{
    objetoNumero = [];
    let numeros = parseInt(req.params.cant);
    if(isNaN(numeros)){
        numeros = 100000000;
    }
    await calcularNumeros(numeros);
    console.log('el objeto numero' , objetoNumero)
    const reducir = objetoNumero.reduce( ( obj , item ) => {
        if( !obj[ item ] ){
            obj[ item ] = 1
        } else{
            obj[ item ] = obj[ item ] + 1;
        }
        return obj
    }, {} );
    console.log(await reducir)
    try {
        child.send(objetoNumero)
        res.render('randoms')
    } catch (error) {
        console.log(error)
    }
});
process.on('message', data=> console.log(data))
export default routerRandoms;
child.on('error', (err) => {
console.log(err)

});
