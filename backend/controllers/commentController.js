import asyncHandler from "../middleware/asyncHandler.js"
import Comment from "../models/commentModel.js";


//@desc     Create comment
//@route    POST/comments
//@access   Private
const createComment = asyncHandler(async(req, res) => {
    //Get the user
    const user = req.user;

    //Get the post id
    const {postId, description} = req.body;
    console.log(description)

    try {
        const comment = await Comment.create({
            post: postId,
            user,
            description
        });
        res.status(200).json(comment);
    } catch (error) {
        res.status(404).json(error)
    }
    
 
});

//@desc     Get all comments
//@route    GET/comments
//@access   Private
const getComments = asyncHandler(async(req, res) => {
    const comments = await Comment.find({}).sort('-createdAt');

    if(comments){
        res.status(200).json(comments);
    }else{
        res.status(404);
        throw new Error("Aucun Commentaire trouvé")
    }  
});

//@desc     Get single comment
//@route    GET/comments/:id
//@access   Private
const getComment = asyncHandler(async(req, res) => {
    const comment = await Comment.findById(req.params.id);

    if(comment){
        res.status(200).json(comment); 
    }else{
        res.status(404);
        throw new Error(`Aucun Commentaire trouvé avec ce ID: ${req.params.id}`);
    }
});

//@desc     Update comment
//@route    PUT/comments/:id
//@access   Private
const updateComment = asyncHandler(async(req, res) => {
    let comment = await Comment.findById(req.params.id);

    if(!comment){
        res.status(404);
        throw new Error(`Il n'y a pas de commentaire avec ce ID ${req.params.id}`)
    };
    //Make sure user is course Owner in order to update course 
    if(comment.user._id.toString() !== req.user.id && req.user.role !== "admin"){
        res.status(400);
        throw new Error(`L'utilisateur avec l'ID ${req.user.id} n'est pas authorisé à modifier ce commentaire`)
    };

    comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    

    res.status(200).json(comment);
});

//@desc     Delete comment
//@route    DELETE/comments/:id
//@access   Private
const deleteComment = asyncHandler(async(req, res) => {
    const comment = await Comment.findById(req.params.id);

    if(!comment){
        res.status(404);
        throw new Error(`Aucun commentaire avec l'ID: ${req.params.id}`)
    };
    //Make sure user is course Owner in order to delete course 
    if(comment.user._id.toString() !== req.user.id && req.user.role !== "admin"){
        res.status(404);
        throw new Error(`L'utilisteur avec l'ID ${req.user.params.id} n'est pas authorisé à suppriment ce mommentaire`)
    };

    await comment.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    })
});


export {
    createComment,
    getComments,
    getComment,
    updateComment,
    deleteComment
}