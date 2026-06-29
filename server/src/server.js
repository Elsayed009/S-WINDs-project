//the server operator file
//

require('dotenv').config();

const app = require('./app'); 
const dpconnect = require('./config/db');

const PORT = process.env.PORT || 6000;

const startServer = async ()=>{
    await dpconnect(); // we make the server wait the db to start first if not then shut the server down no need to it to be runed
    app.listen (PORT, ()=>{ // if db worked well then listen
        console.log(`server is running on port: ${PORT}`); // if all done well then output this msg
    });
}

startServer();





//  سيناريوهات الكوارث والـ Debugging
// الكارثة: Error: connect ECONNREFUSED (الـ MongoDB مش شغال).
// العلامة: السيرفر مش هيبدأ، وهتظهر رسالة err: ....
// الحل: شغل الـ MongoDB أو غير الـ URI في .env.

// الكارثة: Error: Cannot find module './app'.
// العلامة: السيرفر يموت في الأول.
// الحل: تأكد إن app.js موجود في نفس المجلد.



//  مساحة التطور والتوسعة (Scalability)
// لو المشروع كبر، هنضيف هنا cluster module عشان يشغل أكتر من Core في الـ CPU،
//  أو نضيف graceful shutdown عشان يقفل السيرفر بشكل آمن لو حصل إشارة إيقاف.