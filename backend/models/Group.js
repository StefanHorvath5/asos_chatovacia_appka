const mongoose = require("mongoose");

const GroupSchema = mongoose.Schema(
  {
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: {
      type: String,
      required: true,
    },
    channels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Channel" }],
    emojis: [{ type: mongoose.Schema.Types.ObjectId, ref: "Emoji" }],
  },
  {
    toJSON: { virtuals: true },
  }
);

GroupSchema.virtual("users", {
  ref: "UserGroup",
  localField: "_id",
  foreignField: "groupId",
});

module.exports = mongoose.model("Groups", GroupSchema);
