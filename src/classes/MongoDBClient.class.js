import mongoose from "mongoose";
import config from "../config/config.js";
import logger from "../config/logger.config.js";
import clientDB from "./clientDB.class.js";
import NewError from "./NewError.class.js";

let instance = null;

export default class MongoDBClient extends clientDB{
    constructor(){
        super();
        this.connected = false;
        this.client = mongoose; 
    }

    async connect(){
        try {
            await this.client.connect(config.mongodb.atlas.strConn);
            this.connected = true;
            logger.info('Base de datos conectada');
        } catch (error) {
            throw new NewError(500, "Error al conectarse a MongoDB", error)
        }
    }
    async disconnect(){
        try {
            await this.client.connection.close();
            this.connected = false;
            logger.info("Base de datos desconectada");
        } catch (error) {
            throw new NewError(500, "Error al desconectarse de MongoDB", error)
        }
    }

    static getInstance() {
        if (!instance) {
            instance = new MongoDBClient()
        }

        return instance;
    }
}