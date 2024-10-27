const mongoose=require('mongoose');
require('dotenv').config()




exports.connect=()=>{
    mongoose.connect(process.env.DATABASE_URL,{
        useUnifiedTopology:true,
        useNewUrlParser:true
    })
    .then(()=>{
        console.log('connection is setup successfully with database')
    })
    .catch((error)=>{
        console.log(error)
        console.log('db connection failed')
        process.exit(1);
    })
}

