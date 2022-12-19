import NewError from "./NewError.class.js";

export default class clientDB{
    async connect(){
        throw new NewError(500, "Connect no implementado")
    }
    async disconnect(){
        throw new NewError(500, "Disconnect no implementado")
    }
}