import mongoose from "mongoose";
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
    
    describe('POST', () => {
        it('debería incorporar un usuario', async () => {
            const producto = generar()

            const response = await request.post('/').send(producto)
            expect(response.status).to.eql(201)

            const product = response.body
            expect(product).to.include.keys('name', 'price','img','stock','id')
            expect(product.nombre).to.eql(product.nombre)
            expect(product.price).to.eql(product.price)
            expect(product.img).to.eql(product.img)
            expect(product.stock).to.eql(product.stock)
            expect(product.id).to.eql(product.id)
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
        img: 'https://creaciones-natu.vercel.app/images/buho.jpeg',
        stock: 0,
        id: '63a9183e4ogsm1'
    }
    return producto
}