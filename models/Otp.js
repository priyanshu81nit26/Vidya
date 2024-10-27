const mongoose = require("mongoose");
const mailSender = require("../utils/MailSender");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date ,
    default:Date.now(),
    expires:5*60
    
  },
});


async function sendMailVerification(emai,otp)
{
  try {
    const mailResponse=await mailSender(email,"verification email from Vidya",otp);
    console.log('mail sent successfully',mailResponse)
  
  } catch (error) {
    console.log('error while sending email',error)
    throw error
  }
}

// now we will use premiddleware so that only if code will be verified 
// entry will be created will be in database:

otpSchema.pre("save",async function(next)
{
  await sendMailVerification(this.email,this.otp);
  next();
})









module.exports = mongoose.model("OTP",otpSchema);


