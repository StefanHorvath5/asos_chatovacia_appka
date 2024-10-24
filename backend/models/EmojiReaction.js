const mongoose = require("mongoose");

const EmojiReactionSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: {
    type: Number,
    required: true,
    default: 0,
  },
  name: {
    type: String,
    required: true,
  },
  messageId: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
});

EmojiReactionSchema.index(
  { author: 1, name: 1, messageId: 1 },
  { unique: true }
);
module.exports = mongoose.model("EmojiReaction", EmojiReactionSchema);
