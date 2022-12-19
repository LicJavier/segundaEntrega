export default class ProductoDto{
    constructor( producto ){
        this.name = producto.name;
        this.price = producto.price;
        this.img = producto.img;
        this.stock = producto.stock;
        this.id = producto.id;
    }
}