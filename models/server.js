const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../database/config');

//server en clase
class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        
        this.paths = {
            auth: '/api/auth',
            search: '/api/search',//ruta  buscar
            categories: '/api/categories',
            products: '/api/products',
            users: '/api/users',
            uploads: '/api/uploads',
        }

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

        // Fileupload - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true//permite la creacion de carpetas en caso de que no existan
        }));
    }

    routes() {//my routes configuration

        this.app.use( this.paths.auth, require('../routes/auth') );
        this.app.use( this.paths.search, require('../routes/search') );
        this.app.use( this.paths.categories, require('../routes/categories') );
        this.app.use( this.paths.products, require('../routes/products') );
        this.app.use( this.paths.users, require('../routes/user') );
        this.app.use( this.paths.uploads, require('../routes/uploads') );
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log(`Servidor corriendo en puerto: ${this.port}`)
        });
    }

}



module.exports = Server;