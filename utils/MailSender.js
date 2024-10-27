const nodemailer=require('nodemailer');

// this function will send the mail:
// this will be used to send otp to the email
const mailSender=async(email,title,body)=>
{
        try {
            
                // we first create transporter
                let transporter=nodemailer.createTransport({ 
                    host:process.env.MAIL_HOST,
                    auth:{
                        user:process.env.MAIL_USER,
                        pass:process.env.MAIL_PASS // MAIL PASSWORD 
                    }
                });

                // now transporter bnane k bad we can use send mail function
                // to send mail:

                let info=await transporter.sendMail({
                    from:'vidya || VIDYA-BY PRIYANHSU',
                    to: `${email}`,
                    subject:`${title}`,
                    html:`${body}`
                })

                console.log(info);
                return info;




        } catch (error) {
            console.log(error.message);
            
        }
}
module.exports=mailSender