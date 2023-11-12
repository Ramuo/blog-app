import fs from 'fs';
import asyncHandler from "../middleware/asyncHandler.js";
import User from '../models/userModel.js'
import Post from '../models/postModel.js';
import Filter from 'bad-words';
import cloudinaryUploadImg from "../utils/cloudinary.js";

//@desc     Create Post
//@route    POST/api/posts
//@access   Private
const createPost = asyncHandler(async(req, res) => {
    console.log(req.file);
    //Check for bad words
    const filter = new Filter();
    const isProfane = filter.isProfane(req.body.title, req.body.description);
    
    if(isProfane){
         await User.findByIdAndUpdate(req.user._id, {
            isBlocked: true
        });
        res.status(401);
        throw new Error(`Vous êtes bloqué pour utilisation de mot grossier`);
    }

    //1 Get to the path to img
    // const localPath = `upload/images/posts/${req.file.filename}`;
    //Upload to cloudinary
    // const imageUploaded = await cloudinaryUploadImg(localPath);
    

    //Create post
    const post = await Post.create({
        ...req.body, 
        // image: imageUploaded.url,
        user: req.user._id,
    });

    if(!post){
        res.status(404);
        throw new Error("Past non créé");
    };

    //To remove images from local server
    //fs.unlinkSync(localPath);

    res.json(post);
});

//@desc     Get all Posts
//@route    GET/api/posts
//@access   Private
const getPosts = asyncHandler(async(req, res) => {
    const posts = await Post.find({}).populate("user");
    if(posts){
        res.status(200).json(posts);
    }else{
        res.status(404);
        throw new Error("Aucun post");
    }

});

//@desc     Get Single Post
//@route    GET/api/posts
//@access   Private
const getPost = asyncHandler(async(req, res) => {
    const post = await Post.findById(req.params.id).populate("user").populate('disLikes').populate('likes');
    if(!post){
        res.status(404);
        throw new Error("Post non touvé")
    };
    
    //Setup number of views
    await Post.findByIdAndUpdate(post._id, {
        $inc: {numViews: 1}
    }, {new: true});

    res.status(200).json(post);
});

//@desc     Update Post
//@route    PUT/api/posts/:id
//@access   Private
const updatePost = asyncHandler(async(req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, {
            ...req.body,
            user: req.user._id,
        }, {
            new: true
        });
        res.status(200).json(post)
    } catch (error) {
        res.json(error)
    }  
});

//@desc      Post
//@route    DELETE/api/posts/:id
//@access   Private
const deletePost = asyncHandler(async(req, res) => {
    const post = await Post.findById(req.params.id);

    if(!post){
        res.status(404);
        throw new Error(`Il n'y a pas de post avec ${req.params.id}`)
    };

      //Make sure user is post Owner in order to delete post
   if(post.user.toString() !== req.user.id && req.user.role !== "admin"){
    res.status(400);
    throw new Error(`L'utilisateur avec l'ID ${req.user.id} n'est pas authorisé à supprimer le post ${post._id}`)
    };
    await post.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});

//@desc     Like Post
//@route    PUT/api/posts/likes
//@access   Private
const likePost = asyncHandler(async(req, res) => {
    //1 Find the post to be like
    const {postId} = req.body;
    const post = await Post.findById(postId);

    //2 Get the logged in user
    const loginUserId = req.user._id ;

    //3 Find if this user has liked this comment
    const isLiked = post.isLiked
    
    //4 if this user has liked this post
    const alreadyDisliked = post.disLikes.find(
        userId => userId.toString() === loginUserId.toString());
    
    //5 remove the user from dislikes array if it  exist
    if(alreadyDisliked){
        const post = await Post.findByIdAndUpdate(postId, {
            $pull: {disLikes: loginUserId},
            isDisLiked: false,
        }, {
            new: true
        });

        res.status(200).json(post)
    };

    //Toggling
    //6 Remove the user if he has liked the post
    if(isLiked){
        const post = await Post.findByIdAndUpdate(postId, {
            $pull: {likes: loginUserId},
            isLiked: false,
        },{
            new: true,
        });

        res.status(200).json(post)
    }else{
        //Add to likes
        const post = await Post.findByIdAndUpdate(postId, {
            $push: {likes: loginUserId},
            isLiked: true
        }, {
            new: true,
        });

        res.status(200).json(post)
    };  
});

//@desc     DisLike Post
//@route    PUT/api/posts/dislikes
//@access   Private
const disLikePost = asyncHandler(async(req, res) => {
  //1.Find the post to be disLiked
  const { postId } = req.body;
  const post = await Post.findById(postId);
  //2.Find the login user
  const loginUserId = req?.user?._id;
  //3.Check if this user has already disLikes
  const isDisLiked = post?.isDisLiked;
  //4. Check if already like this post
  const alreadyLiked = post?.likes?.find(
    userId => userId.toString() === loginUserId?.toString()
  );
  //Remove this user from likes array if it exists
  if (alreadyLiked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(post);
  }
  //Toggling
  //Remove this user from dislikes if already disliked
  if (isDisLiked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { disLikes: loginUserId },
        isDisLiked: false,
      },
      { new: true }
    );
    res.json(post);
  } else {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { disLikes: loginUserId },
        isDisLiked: true,
      },
      { new: true }
    );
    res.json(post);
  }
});


export {
    createPost,
    getPosts,
    getPost,
    updatePost,
    deletePost,
    likePost,
    disLikePost
}