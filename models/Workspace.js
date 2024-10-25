const {model,Schema} = require("mongoose")
const workspaceSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    discussions:{
        type:[Schema.Types.ObjectId]
    }
},{
    timestamps:true
})
module.exports = model("Workspace",workspaceSchema)