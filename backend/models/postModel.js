import mongoose from 'mongoose';



const postSchema = mongoose.Schema(
    {
        title: {
          type: String,
          // required: [true, "Le titre du message est obligatoire"],
          trim: true,
        },
        //Created by only category
        category: {
          type: String,
          // required: [true, "La catégorie de post est obligatoire"],
        },
        isLiked: {
          type: Boolean,
          default: false,
        },
        isDisLiked: {
          type: Boolean,
          default: false,
        },
        numViews: {
          type: Number,
          default: 0,
        },
        likes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
        disLikes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: [true, "L'auteur est requis"],
        },
        description: {
          type: String,
          // required: [true, "La description est requise"],
        },
        image: {
          type: String,
          default:
            "https://cdn.pixabay.com/photo/2020/10/25/09/23/seagull-5683637_960_720.jpg",
        },
    }, {
        toJSON: {
          virtuals: true,
        },
        toObject: {
          virtuals: true,
        },
        timestamps: true,
    }
);



const Post = mongoose.model('Post', postSchema);
export default Post;