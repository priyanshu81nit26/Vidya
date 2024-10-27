const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    trim: true,
  },
  courseDescription: {
    type: String,
    trim: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  whatYouWillLearn:{
    type:String
  },
  courseContent:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Section"
  }],
  ratingAndReviews:[
    {
        types:mongoose.Schema.types.ObjectId,
        ref:"RatingAndReview"
    }
  ],
  price:{
    type:Number
  },
  thumnail:{
    type:String
  },
  tag:{
    type:mongoose.Schema.types.ObjectId,
    ref:"Tag"
  },
  studentEnrolled:{
    type:mongoose.Schema.types.ObjectId,
    ref:"User",
    required:true
  }
});
module.exports=mongoose.model("Course",courseSchema)
