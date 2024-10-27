const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lasttName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    enum: ["admin", "student", "instructor"],
    required: true,
  },
  additionalDetails: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Profile",
  },
  image: {
    type: String,
    required: true,
  },

  token:{
    type:String
  },
  resetPasswordExpires:{
    type:Date
  },
  courses:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    }
  ],
  courseProgress:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"coursePrgoress"
    }
  ]
});

module.exports=mongoose.model("User",userSchema);
