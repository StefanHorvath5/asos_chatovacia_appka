const Group = require("../models/Group");
const UserGroup = require("../models/UserGroup");
const Channel = require("../models/Channel");
const UserChannel = require("../models/UserChannel");

const getGroups = async (uId) => {
  return await UserGroup.aggregate([
    { $match: { userId: uId } },
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
                              { $eq: ["$userId", uId] },
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
  ]);
};


module.exports = {
  getGroups
};
