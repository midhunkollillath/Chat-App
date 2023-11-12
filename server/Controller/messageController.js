const chatModel = require("../Models/chatModel");
const { MessageModal } = require("../Models/messageModel");
const userModel = require("../Models/userModel");

const sendMessages =async(req,res)=>{
    try {
        const {content,chatId} = req.body;
        if(!content || !chatId){
          return res.status(400).send('errorin undefeidn content')
        }
        let newMessage ={
          sender:req.user_id,
          content:content,
          chat:chatId,
        }
        let message = await MessageModal.create(newMessage)
        message = await message.populate('sender','name')
        message = await message.populate('chat')
        message = await message.populate('reciever')
        message = await userModel.populate(message,{
          path:'chat.users',
          select:'name email'
        })
        await chatModel.findByIdAndUpdate(req.body.chatId,{latesMessage:message})
        res.json(message)
    } catch (error) {
      return res.status(500).send('error in message controller')
    }
}
const Allmessages=async(req,res)=>{
    try {
        const messages = await MessageModal.find({ chat: req.params.chatId })
          .populate("sender", "name email")
          .populate("reciever")
          .populate("chat");
        res.json(messages);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
}

module.exports={sendMessages,Allmessages}