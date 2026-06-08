
// libs

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const routeRoutes = require('./routes/routeRoutes');
const errorHandler = require('./middlewares/errorMiddleware');



const app = express();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin : 'http://localhost:5173',
    credentials: true,
}));

//endpoints routes here:
app.use('/api/auth', authRoutes);
app.use('/api/routes', routeRoutes);





app.get('/', (req, res)=>{
    res.status(200).json({msg: "wind api is ruunnig"});

});

app.use(errorHandler);

module.exports = app;



// const PORT = process.env.PORT || 6000;

// app.listen(PORT, ()=>{
//     console.log(`server is powerd on port: ${PORT}`);
// });

