let {model,Schema} = require("mongoose");
let Message = require("./Message")
let discussionSchema = new Schema({
    messages:{
        type:[Schema.Types.ObjectId]
    }
},{
    timestamps:true
})
discussionSchema.pre("deleteOne",async function(){
    const deletedMessages = this.messages.map((messageId)=>{
        return Message.findByIdAndDelete(messageId);
    })
    await Promise.all(deletedMessages);
})
module.exports = model("Discussion",discussionSchema);