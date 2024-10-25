let {model,Schema} = require("mongoose");
let User = require("./User");
let File = require("./File");
let postSchema = new Schema({
    content:{
        required:true,
        type:String
    },
    files:{
        type:[Schema.Types.ObjectId]
    },
    likes:{
        type:Number,
        default:0
    },
    dislikes:{
        type:Number,
        default:0
    },
    comments:{
        type:[Schema.Types.ObjectId]
    }
},{
    timestamps:true
})
postSchema.pre("deleteOne",async function(){
    try {
        for await (const item of this.likes) {
            let liker = await User.findOne({
                likedPosts:{
                    $in:[this._id]
                }
            })
            if(liker){
                liker.likedPosts.splice(this._id,1);
                await liker.save();
            }
        }
        for await (const item of this.dislikes) {
            let disliker = await User.findOne({
                likedPosts:{
                    $in:[this._id]
                }
            })
            if(disliker){
                disliker.dislikedPosts.splice(this._id,1);
                await disliker.save();
            }
        }
        for await (const item of this.comments) {
            let commenter = await User.findOne({
                comments:{
                    $in:[this._id]
                }
            })
            if(commenter){
                commenter.posts.splice(this._id,1);
                await commenter.save();
            }
        }
        for await (const element of this.files) {
            let file = await File.findById(element);
            if(file){
                await File.findById(file._id);
            }
        }
    } catch (error) {
        console.log(error);
    }
})
module.exports = model("post",postSchema)