const User = require("../models/User");
const Message = require("../models/Message");
const Channel = require("../models/Channel");
const UserGroup = require("../models/UserGroup");
const MessageFile = require("../models/MessageFile");
const EmojiReaction = require("../models/EmojiReaction");

const getMessagesAggregate = async (channelId, numberOfMessages) => {
  console.log(channelId, numberOfMessages)
  return await Message.aggregate([
    { $match: { channel: channelId } },
    {
      $lookup: {
        from: User.collection.name,
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    { $unwind: "$author" },
    {
      $lookup: {
        from: Channel.collection.name,
        pipeline: [{ $match: { _id: channelId } }],
        as: "chnnel",
      },
    },
    { $unwind: "$chnnel" },
    {
      $lookup: {
        from: UserGroup.collection.name,
        let: { authorId: "$author._id", groupId: "$chnnel.group" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$groupId", "$$groupId"] },
                  { $eq: ["$userId", "$$authorId"] },
                ],
              },
            },
          },
        ],
        as: "colorUser",
      },
    },
    {
      $unwind: {
        path: "$colorUser",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: MessageFile.collection.name,
        localField: "files",
        foreignField: "_id",
        as: "files",
      },
    },
    {
      $lookup: {
        from: EmojiReaction.collection.name,
        localField: "emojiReactions",
        foreignField: "_id",
        as: "emojiReactions",
      },
    },
    {
      $project: {
        "author.username": 1,
        text: 1,
        date: 1,
        files: 1,
        emojiReactions: 1,
      },
    },
    { $sort: { date: -1 } },
    { $limit: numberOfMessages },
  ]);
};

const getMessageAggregate = async (channelId, msgId) => {
  return await Message.aggregate([
    { $match: { _id: msgId } },
    {
      $lookup: {
        from: User.collection.name,
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    { $unwind: "$author" },

    {
      $lookup: {
        from: Channel.collection.name,
        pipeline: [{ $match: { _id: channelId } }],
        as: "chnnel",
      },
    },

    { $unwind: "$chnnel" },
    {
      $lookup: {
        from: UserGroup.collection.name,
        let: { authorId: "$author._id", groupId: "$chnnel.group" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$groupId", "$$groupId"] },
                  { $eq: ["$userId", "$$authorId"] },
                ],
              },
            },
          },
        ],
        as: "colorUser",
      },
    },
    {
      $unwind: {
        path: "$colorUser",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: MessageFile.collection.name,
        localField: "files",
        foreignField: "_id",
        as: "files",
      },
    },
    {
      $lookup: {
        from: EmojiReaction.collection.name,
        localField: "emojiReactions",
        foreignField: "_id",
        as: "emojiReactions",
      },
    },
    {
      $project: {
        "author.username": 1,
        text: 1,
        date: 1,
        files: 1,
        emojiReactions: 1,
      },
    },
  ]);
};

module.exports = {
  getMessagesAggregate,
  getMessageAggregate
};
