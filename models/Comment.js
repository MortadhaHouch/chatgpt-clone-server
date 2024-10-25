let {model,Schema} = require("mongoose");
let User = require("./User");
let commentSchema = new Schema({
    author:{
        type:Schema.Types.ObjectId,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    replies:{
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
})
commentSchema.pre("deleteOne",async function(){
    try {
        let commenter = await User.findOne({
            comments:{
                $in:[this._id]
            }
        })
        if(commenter){
            commenter.comments.splice(commenter.comments.indexOf(this._id),1);
            await commenter.save();
        }
        for await (const item of this.likes) {
            let liker = await User.findOne({
                likedComments:{$in:[item]}
            });
            if(liker){
                liker.likedComments.splice(liker.likedComments.indexOf(item),1);
                await liker.save();
            }
        }
        for await (const item of this.dislikes) {
            let disliker = await User.findOne({
                dislikedComments:{$in:[item]}
            });
            if(disliker){
                disliker.dislikedComments.splice(disliker.dislikedComments.indexOf(item),1);
                await disliker.save();
            }
        }
    } catch (error) {
        console.log(error);
    }
})
module.exports = model("comment",commentSchema)