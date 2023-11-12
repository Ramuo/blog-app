import express from 'express';
import {
    loginUser,
    registerUser,
    logoutUser,
    updatePassword,
    genarateEmailVerifToken, 
    accountVerification ,
    forgetPassword,
    resetPassword,
    uploadProfilePhoto
    
} from '../controllers/authController.js';
import {protect, admin} from '../middleware/authMiddleware.js';
import {photoUpload, profilePhotoResize} from '../middleware/photoMiddleware.js';

//Initialize router
const router = express.Router();

router.route('/register') .post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(logoutUser);
router.route('/updatepassword').put(protect, updatePassword);
router.route('/verifyemail').post(protect, genarateEmailVerifToken);
router.route('/accountverify/:veriftoken').put(protect,  accountVerification );
router.route('/forgetpassword').post(forgetPassword);
router.route('/resetpassword/:resettoken').put(resetPassword);
router.route('/profilephoto').put(
    protect, 
    photoUpload.single('image'), 
    profilePhotoResize,
    uploadProfilePhoto);


export default router