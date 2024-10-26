const mongoose = require("mongoose");

const UserGroupSchema = mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});
UserGroupSchema.index({ groupId: 1, userId: 1 }, { unique: true });
module.exports = mongoose.model("UserGroup", UserGroupSchema);
