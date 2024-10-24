const mongoose = require("mongoose");

const EmojiSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  file: {
    type: String,
    required: true,
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
});

module.exports = mongoose.model("Emoji", EmojiSchema);
