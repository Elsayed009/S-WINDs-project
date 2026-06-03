
// libs

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRouters = require('./routes/authRoutes');

const app = express();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin : 'http://localhost:5173',
    credentials: true
}));

//endpoints routes here:
app.use('/api/auth', authRouters);





app.get('/', (req, res)=>{
    res.status(200).json({msg: "wind api is ruunnig"});

});

module.exports = app;



// const PORT = process.env.PORT || 6000;

// app.listen(PORT, ()=>{
//     console.log(`server is powerd on port: ${PORT}`);
// });

