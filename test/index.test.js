import supertest from "supertest";
import { expect } from "chai";
import { app } from "../server.js";

let request
let server

describe('Test de integración de tareas', () =>{
    before(async function(){
        server = await startServer()
        request = supertest(`http://localhost:${server.address().port}/api/productos`)
        console.log("\n*****************COMIENZO TOTAL DEL TEST*********************")
    })

    beforeEach(function(){
        console.log("\n****************COMIENZO DEL TEST*******************")
    })

    describe('GET', () => {
        it('debería retornar un status 200', async () => {
            const response = await request.get('/')
            expect(response.status).to.eql(200)
        })
    })
    
    describe('Guardado de un producto a través de POST en mongoDB Atlas', () => {
        it('Debería obtener un 201 por el guardado', async () => {
            const producto = await generar()
            const response = await request.post('/').send(producto)
            expect(response.status).to.eql(201)
        })
        it('El producto debe incluir keys', async () =>{
            const producto = await generar()
            const response = await request.post('/').send(producto)
            const product = response.body
            console.log(product)
            expect(product).to.have.property('name')
            expect(product).to.have.property('stock')
            expect(product).to.have.property('price')
            expect(product).to.have.property('img')
        })
    })
    afterEach(function(){
        console.log("\n***************EL TEST SE AH COMPLETADO****************")
    })
    after(function () {
        server.close()
        console.log("\n****************FIN TOTAL DEL TEST*******************")
    })
})

async function startServer() {
    return new Promise((resolve, reject) => {
        const PORT = 0
        const server = app.listen(PORT, () => {
            console.log(`Servidor express escuchando en el puerto ${server.address().port}`);
            resolve(server)
        });
        server.on('error', error => {
            console.log(`Error en Servidor: ${error}`)
            reject(error)
        });
    })
}
async function generar() {
    const producto = {
        name: 'PRODUCTO FAKE',
        price: 9999,
        categoria: "mandala" ,
        img: 'https://creaciones-natu.vercel.app/images/buho.jpeg',
        stock: 0
    }
    return producto
}