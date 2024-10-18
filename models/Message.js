let {model,Schema} = require("mongoose");
let messageSchema = new Schema({
    content:{
        type:String,
        required:true
    },
    from:{
        type:Schema.Types.ObjectId,
        required:false
    }
},{
    timestamps:true
})
module.exports = model("Message",messageSchema)