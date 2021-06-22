
var admin = require("firebase-admin");

var serviceAccount = {
    "type": process.env.FIREBASE_TYPE,
    "project_id": process.env.FIREBASE_PROJECT_ID,
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": process.env.FIREBASE_AUTH_URI,
    "token_uri": process.env.FIREBASE_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL,
  }  

// var serviceAccount = require("./marcelina-a-observadora-firebase-adminsdk-mg3ns-a06b3378be.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();


class Logs {
    constructor() {
        this.listaDePresenca = []
        this.listaDeSaida = []
        this.listaDeEntrada = []
        this.listaDeLeitura = [] // TODO

    }

    serverCheck(value){
        // TODO
    }

    async registerMessage(message){
        const docRef = db.collection('messages').doc(message.id);
        
        await docRef.set({...message });
    }

    async memberJoined(member){
        const docRef = db.collection('members_joined').doc(member.user_id);
        
        await docRef.set({...member });
    }

    async memberExited(member){
        const docRef = db.collection('members_exited').doc(member.user_id);
        
        await docRef.set({...member });
    }

    async memberAddNewRole(member){
        const docRef = db.collection('roles_granted').doc();
        
        await docRef.set({...member });
    }

    async memberRemoveOldRole(member){
        const docRef = db.collection('roles_removed').doc();
        
        await docRef.set({...member });
    }

    contabilizaLeitura(){
        // TODO
    }
  }

module.exports = Logs;