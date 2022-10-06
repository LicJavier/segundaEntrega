import { faker } from '@faker-js/faker';
faker.locale = 'es';

export default function generarProducto() {
    const producto = [];
    for (let index = 0; index < 5; index++) {
        producto.push(
            {
                "nombre": faker.commerce.product(),
                "precio": faker.commerce.price(),
                "image": faker.image.food( 200 , 200, true ),
            }
        )
    }
    return producto;
}
