import express from 'express';
import {
    createPost,
    getPosts,
    getPost,
    updatePost,
    deletePost,
    likePost,
    disLikePost
} from '../controllers/postController.js';
import {protect, admin} from '../middleware/authMiddleware.js'
import {photoUpload, postImagrResize} from '../middleware/photoMiddleware.js'


const router = express.Router();

router.route('/').post(
    protect, 
    photoUpload.single('image'),
    postImagrResize,
    createPost);
router.route('/likes').put(protect, likePost);
router.route('/dislikes').put(protect,  disLikePost);
router.route('/').get(getPosts);
router.route('/:id')
    .get(getPost)
    .put(protect, updatePost)
    .delete(protect, deletePost);


export default router;