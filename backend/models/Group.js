const mongoose = require("mongoose");

const GroupSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    channels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Channel" }],
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
