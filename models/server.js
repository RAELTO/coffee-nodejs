const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

//server en clase
class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        
        this.usersPath = '/api/users';
        this.authPath = '/api/auth';

        //db connection
        this.connectDB();

        //Middlewares
        this.middlewares();

        //Rutas de mi app
        this.routes();//dispara el motodo routes
    }

    async connectDB(){
        await dbConnection();
    }

    middlewares() {

        //CORS
        this.app.use( cors() );

        //Lectura y parseo body
        this.app.use( express.json() );

        //Directorio publico
        this.app.use( express.static('public') );
    }

    routes() {//configura mis rutas

        this.app.use( this.authPath, require('../routes/auth') );
        this.app.use( this.usersPath, require('../routes/user') );
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log(`Servidor corriendo en puerto: ${this.port}`)
        });
    }

}



module.exports = Server;