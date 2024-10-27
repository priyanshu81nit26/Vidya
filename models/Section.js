const mongoose=require('mongoose')

const sectionSchema=new mongoose.Schema({
    sctionName:{
        type:String
    },
    subSection:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"SubSection",
            required:true
        }
    ]
});
module.exports=mongoose.model("Section",sectionSchema)