const User = require("../models/User");
const Group = require("../models/Group");
const Channel = require("../models/Channel");
const UserChannel = require("../models/UserChannel");
const UserGroup = require("../models/UserGroup");

const { asyncWrapper } = require("../middleware/async");
const { createCustomError } = require("../errors/customError");

// const { getChannels } = require("../mongoAggregates/channels");

const createChannel = asyncWrapper(async (req, res, next) => {
    const user = await User.findOne({ _id: res.user._id });
    if (!user) {
        return next(createCustomError(`You have been logged out 4`, 401));
    }
    const group = await Group.findOne({ _id: req.body.groupId });
    if (!group) {
        return next(createCustomError(`No such group 1`, 400));
    }
    const newChannel = new Channel({
        group: group._id,
        name: req.body.name,
    });
    const channel = await newChannel.save();
    group.channels.push(channel);
    group.save();

    const usersInGroup = await UserGroup.find({ groupId: group._id });
    for (const x of usersInGroup) {
        await UserChannel.updateOne(
            { channelId: channel._id, userId: x.userId },
            {},
            { upsert: true }
        );
    }

    // const channels = await getChannels(group._id, res.user._id);
    res.status(200).json({
        success: true,
        channels: group.channels,
    });
});


module.exports = {
    createChannel
};
