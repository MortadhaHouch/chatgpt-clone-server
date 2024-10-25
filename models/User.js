let {model,Schema} = require("mongoose")
let bcrypt = require("bcrypt");
let Post = require("./Post");
let Comment = require("./Comment");
let File = require("./File");
let Discussion = require("./Discussion");
let userSchema = new Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isLoggedIn:{
        type:Boolean,
        default:false
    },
    discussions:{
        type:[Schema.Types.ObjectId],
    },
    avatars:{
        type:[Schema.Types.ObjectId],
    },
    posts:{
        type:[Schema.Types.ObjectId],
    },
    comments:{
        type:[Schema.Types.ObjectId],
    },
    likedPosts:{
        type:[Schema.Types.ObjectId],
    },
    dislikedPosts:{
        type:[Schema.Types.ObjectId],
    },
    likedComments:{
        type:[Schema.Types.ObjectId],
    },
    dislikedComments:{
        type:[Schema.Types.ObjectId],
    }
},{
    timestamps:true
})
userSchema.pre("save",async function(){
    if(this.isNew || this.isModified("password")){
        let hash = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(this.password,hash);
        this.password = hashedPassword;
    }
})
userSchema.pre("deleteOne", async function () {
    const deletePosts = this.posts.map(async (postId) => {
        const post = await Post.findById(postId);
        if (post) return Post.deleteOne({ _id: post._id });
    });
    const deleteComments = this.comments.map(async (commentId) => {
        const comment = await Comment.findById(commentId);
        if (comment) return Comment.deleteOne({ _id: comment._id });
    });
    const updateLikedPosts = this.likedPosts.map(async (postId) => {
        return Post.findByIdAndUpdate(
            postId, 
            { $inc: { likes: -1 } },
            { new: true }
        );
    });
    const updateDislikedPosts = this.dislikedPosts.map(async (postId) => {
        return Post.findByIdAndUpdate(
            postId, 
            { $inc: { dislikes: -1 } },
            { new: true }
        );
    });
    const updateLikedComments = this.likedComments.map(async (commentId) => {
        return Comment.findByIdAndUpdate(
            commentId, 
            { $inc: { likes: -1 } },
            { new: true }
        );
    });
    const updateDislikedComments = this.dislikedComments.map(async (commentId) => {
        return Comment.findByIdAndUpdate(
            commentId, 
            { $inc: { dislikes: -1 } },
            { new: true }
        );
    });
    const deletedDiscussions = this.discussions.map(async (discussionId) => {
        return Discussion.findByIdAndDelete(discussionId);
    })
    const deletedAvatars = this.avatars.map(async (avatarId) => {
        return File.findByIdAndDelete(avatarId);
    })
    await Promise.all([
        ...deletePosts,
        ...deleteComments,
        ...updateLikedPosts,
        ...updateDislikedPosts,
        ...updateLikedComments,
        ...updateDislikedComments,
        ...deletedDiscussions,
        ...deletedAvatars
    ]);
});
module.exports = model("User",userSchema)