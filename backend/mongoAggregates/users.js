const User = require("../models/User");
const Group = require("../models/Group");
const UserGroup = require("../models/UserGroup");
const UserChannel = require("../models/UserChannel");
const Channel = require("../models/Channel");

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
                }
              ],
              as: "group",
            },
          },
          {
            $project: {
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
