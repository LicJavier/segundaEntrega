
let objetoNumero = [];

async function random(min, max) {
    let resultado = Math.floor((Math.random() * (max - min + 1)) + min);
    return resultado
}

async function calcularNumeros(params) {
    objetoNumero = [];
    for (let index = 0; index < params; index++) {
        objetoNumero.push(await random( 1 , 1000 ))
    }
}

process.on("message", async function (data) {
    console.log(`Message from main.js: ${data}`);
    await calcularNumeros(data);
    const reducir = await objetoNumero.reduce( ( obj , item ) => {
        if( !obj[ item ] ){
            obj[ item ] = 1
        } else{
            obj[ item ] = obj[ item ] + 1;
        }
        return obj
    }, {} );
    process.send(await reducir);
});
