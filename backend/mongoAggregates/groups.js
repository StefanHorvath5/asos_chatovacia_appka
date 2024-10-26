const Group = require("../models/Group");
const UserGroup = require("../models/UserGroup");
const Channel = require("../models/Channel");

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
