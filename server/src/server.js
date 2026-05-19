require('dotenv').config();

const app = require('./app');
const dpconnect = require('./config/db');

const PORT = process.env.PORT || 6000;

const startServer = async ()=>{
    await dpconnect();
    app.listen (PORT, ()=>{
        console.log(`server is running on port: ${PORT}`);
    });
}

startServer();

