const mongoose = require("mongoose");
const Message = require("../models/Message");
const UserChannel = require("../models/UserChannel");
const MessageFile = require("../models/MessageFile");

const { asyncWrapperNormalFuctions } = require("../middleware/async");

const {
    getMessagesAggregate,
    getMessageAggregate,
} = require("../mongoAggregates/messages");
const EmojiReaction = require("../models/EmojiReaction");

const normalError = {
    success: false,
    statusCode: 500,
    message: "Something went wrong",
};

const getMessages = asyncWrapperNormalFuctions(
    async (channelId, numberOfMessages) => {
        const messages = await getMessagesAggregate(
            new mongoose.Types.ObjectId(channelId),
            numberOfMessages
        );
        return {
            success: true,
            statusCode: 200,
            messages: messages.reverse(),
        };
    },
    normalError
);

const addMessage = asyncWrapperNormalFuctions(
    async (socket, channelId, text, fileMessages) => {
        const author = socket.data.user;
        if (!(fileMessages || text)) {
            return {
                success: false,
                statusCode: 400,
                message: "Empty message submited",
            };
        }
        const newMessage = new Message({
            author: author._id,
            channel: channelId,
        });
        if (text) {
            newMessage.text = text;
        }
        const msg = await newMessage.save();
        if (fileMessages) {
            for (let i = 0; i < fileMessages.length; i++) {
                const newFileMessage = new MessageFile({
                    public_id: fileMessages[i].public_id,
                    resource_type: fileMessages[i].resource_type,
                    bytes: fileMessages[i].bytes,
                    url: fileMessages[i].url,
                    secure_url: fileMessages[i].secure_url,
                    created_at: fileMessages[i].created_at,
                    width: fileMessages[i].width,
                    height: fileMessages[i].height,
                    format: fileMessages[i].format,
                    actual_filename: fileMessages[i].actual_filename,
                    messageId: msg._id,
                });
                const fileM = await newFileMessage.save();
                msg.files.push(fileM);
            }
        }
        await msg.save();
        const returnMsg = await getMessageAggregate(
            new mongoose.Types.ObjectId(channelId),
            msg._id
        );
        await UserChannel.updateMany(
            { channelId: channelId, userId: { $ne: author._id } },
            { $set: { notRead: true } }
        );

        return {
            success: true,
            statusCode: 200,
            returnMsg: returnMsg[0],
        };
    },
    normalError
);


const addReactionToMessage = asyncWrapperNormalFuctions(
    async (socket, channelId, msgId, emojiName, toggleEmoji) => {
        const author = socket.data.user._id;
        const message = await Message.findById(msgId);
        const getMessageReaction = await EmojiReaction.findOne({
            author: author,
            messageId: message._id,
            name: emojiName,
        });

        if (getMessageReaction) {
            if (toggleEmoji) {
                message.emojiReactions.pull(getMessageReaction);
                await message.save();
                await EmojiReaction.deleteOne({ _id: getMessageReaction._id });
            } else {
                return {
                    success: false,
                };
            }
        } else {
            const newMessageReaction = new EmojiReaction({
                author: author,
                name: emojiName,
                messageId: message._id,
            });
            const reaction = await newMessageReaction.save();
            message.emojiReactions.push(reaction);
            await message.save();
        }

        const returnMsg = await getMessageAggregate(
            new mongoose.Types.ObjectId(channelId),
            message._id
        );

        return {
            success: true,
            statusCode: 200,
            returnMsg: returnMsg[0],
        };
    },
    normalError
);
module.exports = {
    addMessage,
    getMessages,
    addReactionToMessage,
};
