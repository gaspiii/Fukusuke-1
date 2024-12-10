import mongoose from 'mongoose'

export const connectDB = async () => { 

    try{ 
    
  await mongoose.connect("mongodb://localhost/fukusuke") 
    
    console.log("Base de datos Conectada") 
    
   }catch(error){ 
    
   console.log(error) 
    
 } 
    
     
    
    } 