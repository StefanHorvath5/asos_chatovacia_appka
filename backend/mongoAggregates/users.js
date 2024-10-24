const User = require("../models/User");
const Group = require("../models/Group");
const UserGroup = require("../models/UserGroup");
const UserChannel = require("../models/UserChannel");
const Channel = require("../models/Channel");
const Emoji = require("../models/Emoji");

const getUserWithGroups = async (username) => {
  return await User.aggregate([
    { $match: { username: username } },
    {
      $lookup: {
        from: UserGroup.collection.name,
        let: { uId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$$uId", "$userId"] },
            },
          },
          { $unwind: "$color" },
          {
            $lookup: {
              from: Group.collection.name,
              let: { groupId: "$groupId" },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$_id", "$$groupId"] },
                  },
                },
                {
                  $lookup: {
                    from: Channel.collection.name,
                    let: { channels: "$channels" },
                    pipeline: [
                      {
                        $match: {
                          $expr: { $in: ["$_id", "$$channels"] },
                        },
                      },
                      {
                        $lookup: {
                          let: { channelId: "$_id" },
                          from: UserChannel.collection.name,
                          pipeline: [
                            {
                              $match: {
                                $expr: {
                                  $and: [
                                    { $eq: ["$channelId", "$$channelId"] },
                                    { $eq: ["$userId", "$$uId"] },
                                  ],
                                },
                              },
                            },
                            {
                              $project: {
                                _id: 0,
                                lastRead: 1,
                                notRead: 1,
                              },
                            },
                          ],
                          as: "userChannel",
                        },
                      },
                      {
                        $unwind: "$userChannel",
                      },
                    ],
                    as: "channels",
                  },
                },
                {
                  $lookup: {
                    from: Emoji.collection.name,
                    localField: "emojis",
                    foreignField: "_id",
                    as: "emojis",
                  },
                },
              ],
              as: "group",
            },
          },
          {
            $project: {
              color: 1,
              group: 1,
            },
          },
          { $unwind: "$group" },
        ],
        as: "groups",
      },
    },
  ]);
};

module.exports = {
  getUserWithGroups,
};
