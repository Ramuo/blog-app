import express from 'express';

import {
    createCategory,
    getCategories,
    getCategory,
    updateCategory ,
    deleteCategory
} from '../controllers/categoryController.js';

import {protect} from '../middleware/authMiddleware.js';


const router = express.Router();


router.route('/')
    .post(protect, createCategory)
    .get(getCategories);
router.route('/:id')
    .get(protect, getCategory)
    .put(protect, updateCategory)
    .delete(protect, deleteCategory)

export default router;