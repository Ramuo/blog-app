import asyncHandler from "../middleware/asyncHandler.js";
import Category from '../models/categoryModel.js';



//@desc     Create Category
//@route    POST/category
//@access   private
const createCategory = asyncHandler(async(req, res) => {
    const category = await Category.create({
        user: req.user._id,
        title: req.body.title
    });

    res.status(201).json(category);
});

//@desc     Get All Categories
//@route    GET/category
//@access   private
const getCategories = asyncHandler(async(req, res) => {
    const category = await Category.find({}).populate("user").sort('-createdAt');

    if(category){
        res.status(200).json(category);
    }else{
        res.status(404);
        throw new Error("Selectionner une categorie")
    };
});

//@desc     Get single Category
//@route    GET/category/:id
//@access   private
const getCategory = asyncHandler(async(req, res) => {
    const category = await Category.findById(req.params.id);

    if(category){
        res.status(200).json(category)
    }else{
        res.status(404);
        throw new Error(`Aucune categorie trouver avec l'ID : ${req.params.id}`)
    }
});

//@desc     Update Category
//@route    PUT/category/:id
//@access   private
const updateCategory = asyncHandler(async(req, res) => {
    let category = await Category.findById(req.params.id);

    if(!category){
        res.status(404);
        throw new Error(`Il n'y a pas de categorie avec l'ID: ${req.params.id}`)
    };
   

    category = await Category.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    

    res.status(200).json(category);
});

//@desc     Delete Category
//@route    DELETE/category/:id
//@access   private
const deleteCategory = asyncHandler(async(req, res) => {
    const category = await Category.findById(req.params.id);

    if(!category){
        res.status(404);
        throw new Error(`Aucune categorie avec l'ID: ${req.params.id}`)
    };
    

    await category.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    })
});



export {
    createCategory,
    getCategories,
    getCategory,
    updateCategory ,
    deleteCategory
}