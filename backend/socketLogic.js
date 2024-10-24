const { Server } = require("socket.io");
const { authMiddleware } = require("./middleware/authMiddleware");

const {
    addMessage,
    getMessages,
    changeUserGroupColor,
    addReactionToMessage,
} = require("./socketActions/messages");
const {
    getAndSendAllActiveInGroup,
} = require("./socketActions/rooms");

const { getGroups } = require("./mongoAggregates/groups");

module.exports.sockets = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
        },
    });
    const wrapMiddlewareForSocketIo = (middleware) => (socket, next) =>
        middleware(socket.request, socket.data, next);
    io.use(wrapMiddlewareForSocketIo(authMiddleware));

    io.on("connection", (socket) => {
        socket.on(
            "clientMessage",
            async (channelType, channelId, text, fileMessages, parentMsgId) => {
                const newMsg = await addMessage(
                    socket,
                    channelId,
                    text,
                    fileMessages,
                    parentMsgId
                );
                if (newMsg.success) {
                    io.in(channelId).emit("serverMessage", channelType, newMsg);
                    if (channelType === 0) {
                        io.to(socket.data.groupOldId).emit(
                            "newUnread",
                            socket.data.groupOldId,
                            channelId
                        );
                    }
                } else {
                    socket.emit("errorOccured", newMsg.message);
                }
            }
        );

        socket.on(
            "clientEmojiReaction",
            async (
                channelType,
                channelId,
                msgId,
                emojiType,
                emojiName,
                toggleEmoji
            ) => {
                const newMessageWithReaction = await addReactionToMessage(
                    socket,
                    channelId,
                    msgId,
                    emojiType,
                    emojiName,
                    toggleEmoji
                );
                if (newMessageWithReaction.success) {
                    io.in(channelId).emit(
                        "serverEmojiReaction",
                        channelType,
                        newMessageWithReaction
                    );
                } else {
                    socket.emit("alreadyReacted");
                }
            }
        );


        socket.on(
            "getMessages",
            async (channelType, channelId, numberOfMessages) => {
                const messages = await getMessages(
                    channelId,
                    numberOfMessages
                );
                socket.emit("allMessages", channelType, messages);
            }
        );


        socket.on("joinGroup", async (groupId, callback) => {
            if (
                socket.data.channelOldId &&
                socket.rooms.has(socket.data.channelOldId)
            ) {
                await socket.leave(socket.data.channelOldId);
                socket.data.channelOldId = null;
            }
            socket.data.groupOldId = groupId;
            callback();
        });

        socket.on("joinChannel", async (channelId, callback) => {
            if (
                socket.data.channelOldId &&
                socket.rooms.has(socket.data.channelOldId)
            ) {
                await socket.leave(socket.data.channelOldId);
                socket.data.channelOldId = null;
            }

            await socket.join(channelId);
            socket.data.channelOldId = channelId;
            await readMessage(socket, channelId);
            callback();
        });

        socket.on("disconnect", async () => {
            const groups = await getGroups(socket.data.user._id);
            groups.forEach(async (g) => {
                getAndSendAllActiveInGroup(io, g.group._id.toString());
            });
        });
    });
};
