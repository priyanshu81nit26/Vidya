const mongoose=require('mongoose')

const courseProgressSchema=new mongoose.Schema({
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    },
    // how much videos have been completed:array of videos
    completedVideos:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubSection"
    }
});

module.exports=mongoose.model("CourseProgress",courseProgressSchema)