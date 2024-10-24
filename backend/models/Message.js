const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: {
    type: String,
    required: false,
    trim: true,
  },
  files: [{ type: mongoose.Schema.Types.ObjectId, ref: "MessageFile" }],
  date: {
    type: Date,
    default: Date.now,
  },
  channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },

  emojiReactions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "EmojiReaction" },
  ],
});

module.exports = mongoose.model("Message", MessageSchema);
