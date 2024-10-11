const allowedOrigins = require('./allowedOrigins')

const corsOptions ={
    origin:(origin,callback)=>{
       
        if(allowedOrigins.includes(origin)||!origin){
            callback(null,true)
           
        }else{
            callback(new Error('Not allowed by CORS'))
        }
    },

    credentials:true, 
    optionSuccessStatus:200
    
};

module.exports =corsOptions