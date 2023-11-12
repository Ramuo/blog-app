import express from 'express';
import {
    createComment,
    getComments,
    getComment,
    updateComment,
    deleteComment,
} from '../controllers/commentController.js';
import {protect, admin} from '../middleware/authMiddleware.js'


const router = express.Router();

router.route('/')
    .post(protect, createComment)
    .get(protect, getComments);
router.route('/:id')
    .get(getComment)
    .put(protect, updateComment)
    .delete(protect, deleteComment);


export default router;