let {model,Schema} = require("mongoose");
let Message = require("./Message")
let discussionSchema = new Schema({
    messages:{
        type:[Schema.Types.ObjectId]
    }
},{
    timestamps:true
})
discussionSchema.pre("deleteOne",async function(next){
    for await (const message of this.messages) {
        Message.findByIdAndDelete(message);
    }
    next();
})
module.exports = model("Discussion",discussionSchema);