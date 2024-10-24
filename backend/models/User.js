const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "must provide username"],
      trim: true,
      maxlength: [20, "username can not be more than 20 characters"],
      unique: [true, "That username is already taken"],
    },
    hash: String,
    salt: String,
   groupsAdmin: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
  },
  {
    toJSON: { virtuals: true },
  }
);

UserSchema.virtual("groups", {
  ref: "UserGroup",
  localField: "_id",
  foreignField: "userId",
});

module.exports = mongoose.model("User", UserSchema);
