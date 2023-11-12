const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
            ref:'User'
    },
    content: { type: String, trim: true },
    // reciever:{
    //     type:mongoose.Schema.Types.ObjectId,
    //         ref:'User'
    // },
    chat:{
        type: mongoose.Schema.Types.ObjectId,
         ref: "Chat"
    },
    
},
{timeStamp:true}
)
const MessageModal = mongoose.model('Message',messageSchema)
  
module.exports = {MessageModal}