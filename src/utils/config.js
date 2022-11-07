import * as dotenv from 'dotenv';

dotenv.config();

export default {
    firebase: {
        "type": "service_account",
        "project_id": process.env.FIREBASE_PID,
        "private_key_id": process.env.FIREBASE_PKID,
        "private_key": process.env.FIREBASE_PKEY,
        "client_email": process.env.FIREBASE_MAIL,
        "client_id": process.env.FIREBASE_CID,
        "auth_uri": process.env.FIREBASE_AU,
        "token_uri": process.env.FIREBASE_TU,
        "auth_provider_x509_cert_url": process.env.FIREBASE_AP,
        "client_x509_cert_url": process.env.FIREBASE_CER
    },
    mongodb:
            {
            atlas: {
                strConn: dotenv.config().parsed.MONGO_URL
            }
    }
}
