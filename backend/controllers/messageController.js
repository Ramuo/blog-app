import asyncHandler from '../middleware/asyncHandler.js';
import Message from '../models/messageModel.js';
import sendEmail from '../utils/sendEmail.js';


//@desc     Send Email
//@route    POST/message
//access    Privete
const sendMessage = asyncHandler(async(req, res) => {
    const user = req.user;
    const {to, subject, message} = req.body;
 
    //Sending Email
    try {
        await sendEmail({
            email: user.email,
            to,
            subject,
            message
        });
    
        await Message.create({
            sentBy: user._id,
            from: user.email,
            to,
            message,
            subject,
        });

        res.json('Email Sent');
    } catch (error) {
        console.log(error)
        
        res.status(500);
        throw new Error("Problème d'envoi du messsage");
    }
});


export {
    sendMessage
}