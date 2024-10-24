const mongoose = require("mongoose");

const MessageFile = new mongoose.Schema({
  public_id: { type: String },
  resource_type: { type: String },
  bytes: { type: Number },
  url: { type: String },
  secure_url: { type: String },
  created_at: {
    type: Date,
    default: Date.now,
  },
  width: { type: Number },
  height: { type: Number },
  format: { type: String },
  actual_filename: { type: String },
  messageId: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
});

module.exports = mongoose.model("MessageFile", MessageFile);
