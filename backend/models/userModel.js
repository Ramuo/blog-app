import crypto from 'crypto';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';



const userSchema = mongoose.Schema(
    {
      firstName: {
        required: [true, "First name is required"],
        type: String,
      },
      lastName: {
        required: [true, "Last name is required"],
        type: String,
      },
      profilePhoto: {
        type: String,
        default:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
      },
      email: {
        type: String,
        required: [true, "Email is required"],
      },
      bio: {
        type: String,
      },
      password: {
        type: String,
        required: [true, "Hei buddy Password is required"],
      },
      postCount: {
        type: Number,
        default: 0,
      },
      isBlocked: {
        type: Boolean,
        default: false,
      },
      isAdmin: {
        type: Boolean,
        default: false,
      },
      role: {
        type: String,
        enum: ["Admin", "Guest", "Blogger"],
      },
      isFollowing: {
        type: Boolean,
        default: false,
      },
      isUnFollowing: {
        type: Boolean,
        default: false,
      },
      isAccountVerified: { type: Boolean, default: false },
      accountVerificationToken: String,
      accountVerificationTokenExpires: Date,
  
      viewedBy: {
        type: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
      },
  
      followers: {
        type: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
      },
      following: {
        type: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
      },
      passwordChangeAt: Date,
      passwordResetToken: String,
      passwordResetExpires: Date,
  
      active: {
        type: Boolean,
        default: false,
      },
    },
    {
      toJSON: {
        virtuals: true,
      },
      toObject: {
        virtuals: true,
      },
      
  }, {
      timestamps: true
  }   
);

//TO AUTHANTICATE USER PASSWORD
userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};

//TO CRYPT PASSWORD WHEN REGISTERING NEW USER AND HASH IT
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')){
        next()
    };

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

//TO VERIFY EMAIL ACCOUT
// Genearte and hash email verification token
userSchema.methods.sendEmailVerifToken = function () {
  //Generate the token
  const verificationToken = crypto.randomBytes(20).toString('hex');

  //Hash token and set it to  accountVerificationToken field in userSchema
  this.accountVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex')
  
  //Set token expire
  this.accountVerificationTokenExpires = Date.now() + 10 * 60 * 1000; 

  return verificationToken;
};


//TO RESET PASSWORD
userSchema.methods.getResetTokenPassword = function (){
  //To generate a Token
  const resetToken = crypto.randomBytes(20).toString('hex');

  //Hash token and set it to  passwordResetToken Field

  this. passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')
  
  //Set token expiry
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //10mn 

  return resetToken;
  
};

//Virtual method to populate created post
userSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "user",
  justOne: false
})


const User = mongoose.model('User', userSchema);
export default User;