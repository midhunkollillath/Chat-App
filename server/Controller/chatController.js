
const ChatModel = require('../Models/chatModel')
const userModel = require('../Models/userModel')
const MessageModel = require('../Models/messageModel')
const chatModel = require('../Models/chatModel')
const accessChat =async(req,res)=>{
   
    try {
        const {userId} = req.body
        if(!userId){
            return res.status(400).send('user id is not send')
        }
        let isChat = await ChatModel.find({
            isGroupChat:false,
            $and:[
                {users:{$elemMatch:{$eq:req.user._id}}},
                {users:{$elemMatch:{$eq:userId}}},
            ]
        }) .populate('users','-password')
        .populate('latestMessage')
        
        isChat = await userModel.populate(isChat,{
            path:'latestMessage.sender',
            select:'name pic email',
        })
        if(isChat.length>0){
            res.send(isChat[0])
        }else{
            let chatData ={
                chatName:'sender',
                isGroupChat:false,
                users:[req.user._id,userId]
            }
            const createdChat = await chatModel.create(chatData)
            const Fullchat = await chatModel.findOne({_id:createdChat._id}).populate('users','-password')
           
            res.status(200).json(Fullchat)
        }
       } catch (error) {
         console.log(error,'error in acces chat')
         res.status(400).send('error in acces chat')
    }
}

const fetchChats =async(req,res)=>{
    try {
        const {userId} = req.body;
        await chatModel.find({
            users:{$elemMatch:{$eq:userId}} })
            .populate('users','-password',)
            .populate('groupAdmin','-password')
            .populate('latestMessage')
            .sort({updatedAt:-1})
            .then(async(result)=>{
                result = await userModel.populate(result,{
                    path:'latestMessage.sender',
                    select:'name email',
                })
                
                res.status(200).json(result)
            })
            
       
    } catch (error) {
        console.log(error,'error in feecthing chats')
    }
}
const createGroups =async(req,res)=>{
    try {
        if(!req.body.user  || !req.body.name){
            return res.status(400).send({message:'Data is insuffcient'})
        }
        let users = JSON.parse(req.body.users)
        if (users.length < 2) {
            return res
              .status(400)
              .send("More than 2 users are required to form a group chat");
          }
        users.push(req.user)
        const groupChat = await chatModel.create({
            chatName:req.body.name,
            users:users,
            isGroupChat:true,
            groupAdmin:req.user,
        })
        const fullGroupChat = await chatModel.findOne({_id:groupChat._id})
        .populate('users','-password',)
        .populate('groupAdmin','-password')
        res.status(200).json(fullGroupChat)
    } catch (error) {
        
    }
}
const fetchGroups=async(req,res)=>{
    try {
        const allGroups = await chatModel.find({isGroupChat:true})
        res.status(200).json(allGroups)
    } catch (error) {
        console.log(error,'error in fecthing groups')
    }
}
const deleteGroups= async(req,res)=>{
    try {
        const {chatId,userId} = req.body;
        const removed = await chatModel.findByIdAndUpdate(
            chatId,
            {
                $pull:userId,
            },
            {
                new:true,
            },
        )
        .populate('users','-password')
        .populate('groupAdmin','-password')
        if(!removed){
            return res.status(400).send('chat not found')
        }else{
            res.status(200).json(removed)
        }
    } catch (error) {
        console.log(error,'error in delete group')
    }
}
const addToGroup =async(req,res)=>{
    try {
        const {chatId,userId} = req.body
        const added = await chatModel.findByIdAndUpdate(
            chatId,
            {
                $push:{users:userId}
            },{
                new:true
            },
        ).populate('users','-password')
        .populate('groupAdmin','-password')
        if(!added){
            return res.status(400).send('not added')
        }else{
            res.status(200).json(added)
        }
    } catch (error) {
        console.log(error,'error in add group')
    }
}
const renameGroup=async(req,res)=>{
    
    try {
        const {chatId,chatName} = req.body;
    const updatedChat = await chatModel.findByIdAndUpdate(chatId,{
        chatName:chatName
    },{new:true}).populate('users','-password').populate('groupAdmin','-password');
    if(!updatedChat){
        res.status(404).send('Chat not found')
    }else{
        res.status(200).json(updatedChat)
    }
    } catch (error) {
        console.log(error,'error in rename group')
    }
}
module.exports={accessChat,deleteGroups,fetchGroups,fetchChats,createGroups,addToGroup,renameGroup}