const mongoose = require('mongoose');

const dbConnection = async ()=>{
    try{
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log(`db connected seccussfuly ${connect.connection.host}`)
    }catch(err){
        console.log(`err: ${err.message}`);
        process.exit(1); // if the connect faild the server shutdawn
    }
};


// now we export it like any endpoint 
module.exports = dbConnection;
// we will catch it in the app file 