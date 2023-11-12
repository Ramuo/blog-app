import asyncHandler from '../middleware/asyncHandler.js';
import User  from '../models/userModel.js';
//import generateToken from '../utils/generateToken.js';


//@desc     Get all users
//@route    GET /api/users
//@access   Private/Admin 
const getUsers = asyncHandler(async(req, res) => {
    const users = await User.find({});
    res.status(200).json(users);
});


//@desc     Delete users
//@route    DELETE /api/users/:id
//@access   Private/Admin
const deleteUser = asyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id);

    if(user){
        if(user.isAdmin){
            res.status(404);
            throw new Error("Impossible de supprimer un amdministrateur")
        }
        await User.deleteOne({_id: user._id});
        res.status(200).json({message: 'Utilisateur supprimé avec succès'});
    }else{
        res.status(404);
        throw new Error('Utilisateur non trouvé');
    }
});

//@desc     Get user by ID /Single User
//@route    GET /api/users/:id
//@access   Private
const getUser = asyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id).select('-password');

    if(user){
        res.status(200).json(user);
    }else{
        res.status(404);
        throw new Error("Utilisateur non trouvé");
    }
});

//@desc     Get user profile
//@route    GET /api/users/profile
//@access   Private
const getUserProfile = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id).populate('posts');

    // check if  user
    if(user){
        res.status(200).json(user)
    }else{
        res.status(404);
        throw new Error("Utilisateur non trové");
    };
});

//@desc     Update user profile
//@route    PUT /api/users/profile
//@access   Private
const updateUserProfile = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id);

    //Check if user 
    if(user){
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.email = req.body.email || user.email;
        user.bio = req.body.bio || user.bio;

        //Save the updated changes
        const updatedUser = await user.save(); 

        res.status(200).json({
            _id: updatedUser._id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            bio: updatedUser.bio
        });
    }else{
        res.status(404);
        throw new Error("Utilisateur non trouvé")
    };

});

//@desc     Follow a user
//@route    Put /api/users/follow
//@access   Private
const followUser = asyncHandler(async(req, res) => {
    const {followId} = req.body;
    const user = await User.findById(req.user._id);

    //Find the target user and check if the logged id exist
    const targetUser = await User.findById(followId)
    
    const alreadyFollowing = targetUser.followers.find(
        target => target.toString() === user._id.toString()
    );
    
    if(alreadyFollowing){
        res.status(404);
        throw new Error(`Vous suivez déja ${req.user.firstName}`)
    };

     //Find the user you want to follow
    await User.findByIdAndUpdate(followId, {
        $push: {followers: user._id}
    }, {
        new: true,
    });

    await User.findByIdAndUpdate(user._id, {
        $push: {following: followId}
    }, {
        new: true,
    });

    res.json({
        message: `Vous suivez maintenant ${req.user.firstName}`
    })
});

//@desc     unFollow a user
//@route    Put /api/users/unfollow
//@access   Private
const unFollowUser = asyncHandler(async(req, res) => {
    const {unFollowId} = req.body;
    const user = await User.findById(req.user._id);

    await User.findByIdAndUpdate(unFollowId, {
        $pull: {followers: user._id},
        isFollowing: false
    }, {new: true});


    await User.findByIdAndUpdate(user._id, {
        $pull: {following: unFollowId},
    }, {new: true});



    res.json({
        message: `Vous ne suivez plus cet utilisateur `
    })
});

//@desc     Block a user
//@route    Put /api/users/blockuser/:id
//@access   Private/admin
const blockUser = asyncHandler(async(req, res) => {
    const user = await User.findByIdAndUpdate(req.user._id, {
        isBlocked: true
    }, 
    {new: true}
    );
    res.json(user)
});

//@desc     unBlock a user
//@route    Put /api/users/blockuser/:id
//@access   Private/admin
const unBlockUser = asyncHandler(async(req, res) => {
    const user = await User.findByIdAndUpdate(req.user._id, {
        isBlocked: false
    }, 
    {new: true}
    );
    res.json(user)
});


export {
    getUsers,
    deleteUser,
    getUser,
    getUserProfile,
    updateUserProfile,
    followUser,
    unFollowUser,
    blockUser,
    unBlockUser,   
}
