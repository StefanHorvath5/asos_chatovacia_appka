const mongoose = require("mongoose");

const ChannelSchema = mongoose.Schema(
  {
    group: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
    type: { type: Number },
    name: {
      type: String,
      required: true,
    },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
    recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  }
);

ChannelSchema.virtual("users", {
  ref: "UserChannel",
  localField: "_id",
  foreignField: "channelId",
});
module.exports = mongoose.model("Channel", ChannelSchema);
