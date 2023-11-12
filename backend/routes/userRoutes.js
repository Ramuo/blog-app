import express from 'express';
import {
    getUsers,
    getUserProfile,
    deleteUser,
    getUser,
    updateUserProfile,
    followUser,
    unFollowUser,
    blockUser,
    unBlockUser
    // updateUser
} from '../controllers/userController.js';
import {protect, admin} from '../middleware/authMiddleware.js'

//Initialize router 
const router = express.Router();

router.route('/').get(protect, getUsers);
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);
router.route('/follow').put(protect, followUser);
router.route('/unfollow').put(protect, unFollowUser);
router.route('/blockuser/:id').put(protect, blockUser);
router.route('/unblockuser/:id').put(protect, unBlockUser);
router.route('/:id')
    .delete(deleteUser)
    .get(protect, getUser)
    



export default router

