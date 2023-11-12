import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();
import crypto from "crypto";
import asyncHandler from '../middleware/asyncHandler.js';
import User  from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import cloudinaryUploadImg from '../utils/cloudinary.js'




//@desc     Register new user (signup)
//@route    POST /api/auth
//@access   Public
const registerUser = asyncHandler(async(req, res) => {
    const {
        firstName, 
        lastName, 
        email, 
        password
    } = req.body;

    // Find user by email
    const userExist = await User.findOne({ email });

    // Check if user exist alredy
    if(userExist){
        res.status(400);
        throw new Error("L'utilistaur existe déjà")
    };

    //To create new user it does'nt exist
    const user = await User.create({
        firstName, 
        lastName, 
        email,
        password
    });

    //Once user created, then set it into db
    if(user){
        generateToken(res, user._id);

        res.status(201).json({
           massage: "Votre compte a été crée",
           data: user
        });
    }else{
        res.status(400);
        throw new Error("Information invalide")
    };

});


//@desc     Login user & and get the token (signin)
//@route    POST /api/auth/login
//@access   Public
const loginUser = asyncHandler(async(req, res) => {
   const {email, password} = req.body;

   //Let us find a user
   const user = await User.findOne({ email });

   // Let's validate user cedentials
   if(user && (await user.matchPassword(password))){
    generateToken(res, user._id);

    res.status(200).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePhoto: user.profilePhoto,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified
    })
   }else{
    res.status(401);
    throw new Error("Email ou mot de passe invalide");
   }
});


//@desc     Logout user / clear the cookie
//@route    POST /api/auth/logout
//@access   Private
const logoutUser = asyncHandler(async(req, res) => {
    res.cookie('jwt', '', {
       httpOnly: true,
       expires: new Date(0)
    });

    res.status(200).json({message: "Déconnecté avec succès"});
});

// @desc      Update password
// @route     PUT /api/auth/updatepassword
// @access    Private
const updatePassword = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user.id).select("+password");

    //Check if user
    if(user){
         //Let's check if in the request sent, if there is a password
         if(req.body.password){
            user.password = req.body.password
        };

        //Save the updated changes
        const updatedPassword = await user.save();

        res.status(200).json({
            message: "Votre mot de passe a été modififié",
            data: updatedPassword
        });
    }else{
        res.status(404);
        throw new Error("Mot de passe incorrect");
    };
});

//@desc     Verify Email 
//@route    POST /api/auth/verifyemail
//@access   Private
const genarateEmailVerifToken = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id);
    
    if(!user){
        res.status(404);
        throw new Error(`Il n'y a pas d'utilisateur avec cette adresse ${req.user.email}`)
    }

    //Get verification token 
    const verificationToken = user.sendEmailVerifToken();
    console.log(verificationToken);

    await user.save({validateBeforeSave: false});

    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/verifyemail/${verificationToken}`;

    //Create reset Url
    const message = `
    Cliquer sur le lien suivant pour verifier votre email, 
    ${resetUrl}
    Le lien expire dans 10 mn.
    `;

    //Sending Email
   try {
    await sendEmail({
        email: user.email,
        subject: "Email de verification",
        message
    });

    res.json('Email Sent');
   } catch (error) {
     console.log(error)
     user.accountVerificationToken = undefined
     user.accountVerificationTokenExpires = undefined,

     await user.save({validateBeforeSave: false});

     res.status(500);
     throw new Error("Problème d'envoi de l'email de verification");
   }
});

//@desc     Account verification
//@route    PUTT /api/auth/accountverif/:veriftoken
//@access   Public
const accountVerification = asyncHandler(async(req, res) => {
    //Get Hash token
    const accountVerifToken = crypto
        .createHash('sha256')
        .update(req.params.veriftoken)
        .digest('hex')
    
    //Find the user by veriftoken only if the expiration is greater than right now
    const user = await User.findOne({
        accountVerificationToken: accountVerifToken,
        accountVerificationTokenExpires: {$gt: new Date()}
    });

    if(!user){
        res.status(400);
        throw new Error("L'autentification a échoué")
    };

    user.isAccountVerified = true;
    user.accountVerificationToken = undefined;
    user.accountVerificationTokenExpires = undefined

    await user.save();

    res.status(200).json({
        _id: user.id,
        email: user.email,
        password: user.password
    });
});

// @desc      Forgot password
// @route     POST /api/auth/forgotpassword
// @access    Public
const forgetPassword = asyncHandler(async(req, res) => {
    const user = await User.findOne({email: req.body.email});

    if(!user){
        res.status(404);
        throw new Error(`Le compte avec l'adresse mail ${req.body.email} n'existe pas, veiller créer un compte`)
    };

    //Get reset token 
    const resetToken = user.getResetTokenPassword();
    console.log(resetToken); 

    await user.save({validateBeforeSave: false});


    //Create resetUrl 
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetpassword/${resetToken}`;
    

    const message = `
    Vous recevez cet e-mail parce que vous
    vous avez demandé la réinitialisation de votre mot de passe. Cliquer sur le lien suivant ${resetUrl}
    `

    //Send Email
    try {
        await sendEmail({
            email: user.email,
            subject: 'Réinitialisation mot de passe',
            message
        });

        res.status(200).json({
            success: true,
            data: 'Email Envoyé'
        });
    } catch (error) {
        console.log(error);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save({validateBeforeSave: false});

        res.status(500);
        throw new Error("Email non envoyé, réessayer")
    };
});

// @desc      Reset password
// @route     PUT /api/auth/resetpassword/:resettoken
// @access    Public
const resetPassword = asyncHandler(async(req, res) => {
    //Get hashed token
    const passwordResetToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    //Find The user by resettoken only if the expiration is greatter than right now
    const user = await User.findOne({
        passwordResetToken,
        passwordResetExpires: {$gt: Date.now()} // Expiry is greater than right now,
    });

    if(!user){
        res.status(404);
        throw new Error("L'authentification a échouée")
    }

    //If we find the user & the Token is not expired, then set new Password 
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    generateToken(res, user._id);

    res.status(200).json({
        _id: user._id,
        email: user.email,
        password: user.password
    });
});

// @desc      Upload photo
// @route     PUT /api/auth/uploadphoto
// @access    Private
const uploadProfilePhoto = asyncHandler(async(req, res) => {
    //1 Get to the path to img
    const localPath = `upload/images/profile/${req.file.filename}`;
    //Upload to cloudinary
    const imageUploaded = await cloudinaryUploadImg(localPath);
   

    const user = await User.findByIdAndUpdate(req.user._id, 
    {
        profilePhoto: imageUploaded.url,
    }, 
    {new: true}
    );
    fs.unlinkSync(localPath);
    res.json(user);
});

export {
    loginUser,
    registerUser,
    logoutUser,
    updatePassword,
    genarateEmailVerifToken,
    accountVerification,
    forgetPassword,
    resetPassword,
    uploadProfilePhoto
}
