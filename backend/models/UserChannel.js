const mongoose = require("mongoose");

const UserChannelSchema = mongoose.Schema({
  channelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel",
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lastRead: {
    type: Date,
    default: Date.now,
  },
  notRead: {
    type: Boolean,
    default: false,
  },
});
UserChannelSchema.index({ channelId: 1, userId: 1 }, { unique: true });
module.exports = mongoose.model("UserChannel", UserChannelSchema);
