const mongoose = require('mongoose');

const dbConnection = async() => {

    try {
        
        await mongoose.connect( process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('DB online');

    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar la db');

    }

}


module.exports = {
    dbConnection
}