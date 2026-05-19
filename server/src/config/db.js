const mongoose = require('mongoose');

const dbConnection = async ()=>{
    try{

    }catch(err){
        console.log(`err: ${err.message}`);
        process.exit(1); // if the connect faild the server shutdawn
    }
};


// now we export it like any endpoint 
module.exports = dbConnection;
// we will catch it in the app file 