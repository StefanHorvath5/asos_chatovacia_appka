const { Server } = require("socket.io");
const { authMiddleware } = require("./middleware/authMiddleware");

const {
    addMessage,
    getMessages,
    addReactionToMessage,
} = require("./socketActions/messages");


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
            async (channelId, text, fileMessages, parentMsgId) => {
                const newMsg = await addMessage(
                    socket,
                    channelId,
                    text,
                    fileMessages,
                    parentMsgId
                );
                if (newMsg.success) {
                    io.in(channelId).emit("serverMessage", newMsg);
                        io.to(socket.data.groupOldId).emit(
                            "newUnread",
                            socket.data.groupOldId,
                            channelId
                        );
                } else {
                    socket.emit("errorOccured", newMsg.message);
                }
            }
        );

        socket.on(
            "clientEmojiReaction",
            async (
                channelId,
                msgId,
                emojiName,
                toggleEmoji
            ) => {
                const newMessageWithReaction = await addReactionToMessage(
                    socket,
                    channelId,
                    msgId,
                    emojiName,
                    toggleEmoji
                );
                if (newMessageWithReaction.success) {
                    io.in(channelId).emit(
                        "serverEmojiReaction",
                        newMessageWithReaction
                    );
                } else {
                    socket.emit("alreadyReacted");
                }
            }
        );


        socket.on(
            "getMessages",
            async (channelId, numberOfMessages) => {
                const messages = await getMessages(
                    channelId,
                    numberOfMessages
                );
                socket.emit("allMessages", messages);
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
            callback();
        });

    });
};
